"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveSearch = exports.displaySearch = exports.SearchType = void 0;
const eris_1 = require("eris");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const utils_1 = require("../../utils");
const pluginUtils_1 = require("../../pluginUtils");
const refreshMembers_1 = require("./refreshMembers");
const getUserInfoEmbed_1 = require("./functions/getUserInfoEmbed");
const RegExpRunner_1 = require("../../RegExpRunner");
const validatorUtils_1 = require("../../validatorUtils");
const async_1 = require("../../utils/async");
const hasDiscordPermissions_1 = require("../../utils/hasDiscordPermissions");
const SEARCH_RESULTS_PER_PAGE = 15;
const SEARCH_ID_RESULTS_PER_PAGE = 50;
const SEARCH_EXPORT_LIMIT = 1000000;
var SearchType;
(function (SearchType) {
    SearchType[SearchType["MemberSearch"] = 0] = "MemberSearch";
    SearchType[SearchType["BanSearch"] = 1] = "BanSearch";
})(SearchType = exports.SearchType || (exports.SearchType = {}));
class SearchError extends Error {
}
function getOptimizedRegExpRunner(pluginData, isSafeRegex) {
    if (isSafeRegex) {
        return async (regex, str) => {
            if (!regex.global) {
                const singleMatch = regex.exec(str);
                return singleMatch ? [singleMatch] : null;
            }
            const matches = [];
            let match;
            // tslint:disable-next-line:no-conditional-assignment
            while ((match = regex.exec(str)) != null) {
                matches.push(match);
            }
            return matches.length ? matches : null;
        };
    }
    return pluginData.state.regexRunner.exec.bind(pluginData.state.regexRunner);
}
async function displaySearch(pluginData, args, searchType, msg) {
    // If we're not exporting, load 1 page of search results at a time and allow the user to switch pages with reactions
    let originalSearchMsg;
    let searching = false;
    let currentPage = args.page || 1;
    let hasReactions = false;
    let clearReactionsFn;
    let clearReactionsTimeout;
    const perPage = args.ids ? SEARCH_ID_RESULTS_PER_PAGE : SEARCH_RESULTS_PER_PAGE;
    const loadSearchPage = async (page) => {
        if (searching)
            return;
        searching = true;
        // The initial message is created here, as well as edited to say "Searching..." on subsequent requests
        // We don't "await" this so we can start loading the search results immediately instead of after the message has been created/edited
        let searchMsgPromise;
        if (originalSearchMsg) {
            searchMsgPromise = originalSearchMsg.edit("Searching...");
        }
        else {
            searchMsgPromise = msg.channel.createMessage("Searching...");
            searchMsgPromise.then(m => (originalSearchMsg = m));
        }
        let searchResult;
        try {
            switch (searchType) {
                case SearchType.MemberSearch:
                    searchResult = await performMemberSearch(pluginData, args, page, perPage);
                    break;
                case SearchType.BanSearch:
                    searchResult = await performBanSearch(pluginData, args, page, perPage);
                    break;
            }
        }
        catch (e) {
            if (e instanceof SearchError) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
                return;
            }
            if (e instanceof validatorUtils_1.InvalidRegexError) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
                return;
            }
            throw e;
        }
        if (searchResult.totalResults === 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No results found");
            return;
        }
        const resultWord = searchResult.totalResults === 1 ? "matching member" : "matching members";
        const headerText = searchResult.totalResults > perPage
            ? utils_1.trimLines(`
            **Page ${searchResult.page}** (${searchResult.from}-${searchResult.to}) (total ${searchResult.totalResults})
          `)
            : `Found ${searchResult.totalResults} ${resultWord}`;
        const resultList = args.ids
            ? formatSearchResultIdList(searchResult.results)
            : formatSearchResultList(searchResult.results);
        const result = utils_1.trimLines(`
        ${headerText}
        \`\`\`js
        ${resultList}
        \`\`\`
      `);
        const searchMsg = await searchMsgPromise;
        const cfg = await pluginData.config.getForUser(msg.author);
        if (cfg.info_on_single_result && searchResult.totalResults === 1) {
            const embed = await getUserInfoEmbed_1.getUserInfoEmbed(pluginData, searchResult.results[0].id, false);
            if (embed) {
                searchMsg.edit("Only one result:");
                msg.channel.createMessage({ embed });
                return;
            }
        }
        searchMsg.edit(result);
        // Set up pagination reactions if needed. The reactions are cleared after a timeout.
        if (searchResult.totalResults > perPage) {
            if (!hasReactions) {
                hasReactions = true;
                searchMsg.addReaction("⬅");
                searchMsg.addReaction("➡");
                searchMsg.addReaction("🔄");
                const listenerFn = pluginData.events.on("messageReactionAdd", ({ args: { message: rMsg, emoji, member } }) => {
                    if (rMsg.id !== searchMsg.id)
                        return;
                    if (member.id !== msg.author.id)
                        return;
                    if (!["⬅", "➡", "🔄"].includes(emoji.name))
                        return;
                    if (emoji.name === "⬅" && currentPage > 1) {
                        loadSearchPage(currentPage - 1);
                    }
                    else if (emoji.name === "➡" && currentPage < searchResult.lastPage) {
                        loadSearchPage(currentPage + 1);
                    }
                    else if (emoji.name === "🔄") {
                        loadSearchPage(currentPage);
                    }
                    if (utils_1.isFullMessage(rMsg)) {
                        rMsg.removeReaction(emoji.name, member.id);
                    }
                });
                clearReactionsFn = async () => {
                    searchMsg.removeReactions().catch(utils_1.noop);
                    pluginData.events.off("messageReactionAdd", listenerFn);
                };
            }
            clearTimeout(clearReactionsTimeout);
            clearReactionsTimeout = setTimeout(clearReactionsFn, 5 * utils_1.MINUTES);
        }
        currentPage = searchResult.page;
        searching = false;
    };
    loadSearchPage(currentPage);
}
exports.displaySearch = displaySearch;
async function archiveSearch(pluginData, args, searchType, msg) {
    let results;
    try {
        switch (searchType) {
            case SearchType.MemberSearch:
                results = await performMemberSearch(pluginData, args, 1, SEARCH_EXPORT_LIMIT);
                break;
            case SearchType.BanSearch:
                results = await performBanSearch(pluginData, args, 1, SEARCH_EXPORT_LIMIT);
                break;
        }
    }
    catch (e) {
        if (e instanceof SearchError) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
            return;
        }
        if (e instanceof validatorUtils_1.InvalidRegexError) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
            return;
        }
        throw e;
    }
    if (results.totalResults === 0) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No results found");
        return;
    }
    const resultList = args.ids ? formatSearchResultIdList(results.results) : formatSearchResultList(results.results);
    const archiveId = await pluginData.state.archives.create(utils_1.trimLines(`
      Search results (total ${results.totalResults}):

      ${resultList}
    `), moment_timezone_1.default.utc().add(1, "hour"));
    const baseUrl = pluginUtils_1.getBaseUrl(pluginData);
    const url = await pluginData.state.archives.getUrl(baseUrl, archiveId);
    await msg.channel.createMessage(`Exported search results: ${url}`);
}
exports.archiveSearch = archiveSearch;
async function performMemberSearch(pluginData, args, page = 1, perPage = SEARCH_RESULTS_PER_PAGE) {
    await refreshMembers_1.refreshMembersIfNeeded(pluginData.guild);
    let matchingMembers = Array.from(pluginData.guild.members.values());
    if (args.role) {
        const roleIds = args.role.split(",");
        matchingMembers = matchingMembers.filter(member => {
            for (const role of roleIds) {
                if (!member.roles.includes(role))
                    return false;
            }
            return true;
        });
    }
    if (args.voice) {
        matchingMembers = matchingMembers.filter(m => m.voiceState.channelID != null);
    }
    if (args.bot) {
        matchingMembers = matchingMembers.filter(m => m.bot);
    }
    if (args.query) {
        let isSafeRegex = true;
        let queryRegex;
        if (args.regex) {
            const flags = args["case-sensitive"] ? "" : "i";
            queryRegex = validatorUtils_1.inputPatternToRegExp(args.query.trimStart());
            queryRegex = new RegExp(queryRegex.source, flags);
            isSafeRegex = false;
        }
        else {
            queryRegex = new RegExp(escape_string_regexp_1.default(args.query.trimStart()), args["case-sensitive"] ? "" : "i");
        }
        const execRegExp = getOptimizedRegExpRunner(pluginData, isSafeRegex);
        if (args["status-search"]) {
            matchingMembers = await async_1.asyncFilter(matchingMembers, async (member) => {
                if (member.game) {
                    if (member.game.name && (await execRegExp(queryRegex, member.game.name).catch(RegExpRunner_1.allowTimeout))) {
                        return true;
                    }
                    if (member.game.state && (await execRegExp(queryRegex, member.game.state).catch(RegExpRunner_1.allowTimeout))) {
                        return true;
                    }
                    if (member.game.details && (await execRegExp(queryRegex, member.game.details).catch(RegExpRunner_1.allowTimeout))) {
                        return true;
                    }
                    if (member.game.assets) {
                        if (member.game.assets.small_text &&
                            (await execRegExp(queryRegex, member.game.assets.small_text).catch(RegExpRunner_1.allowTimeout))) {
                            return true;
                        }
                        if (member.game.assets.large_text &&
                            (await execRegExp(queryRegex, member.game.assets.large_text).catch(RegExpRunner_1.allowTimeout))) {
                            return true;
                        }
                    }
                    if (member.game.emoji && (await execRegExp(queryRegex, member.game.emoji.name).catch(RegExpRunner_1.allowTimeout))) {
                        return true;
                    }
                }
                return false;
            });
        }
        else {
            matchingMembers = await async_1.asyncFilter(matchingMembers, async (member) => {
                if (member.nick && (await execRegExp(queryRegex, member.nick).catch(RegExpRunner_1.allowTimeout))) {
                    return true;
                }
                const fullUsername = `${member.user.username}#${member.user.discriminator}`;
                if (await execRegExp(queryRegex, fullUsername).catch(RegExpRunner_1.allowTimeout))
                    return true;
                return false;
            });
        }
    }
    const [, sortDir, sortBy] = (args.sort && args.sort.match(/^(-?)(.*)$/)) ?? [null, "ASC", "name"];
    const realSortDir = sortDir === "-" ? "DESC" : "ASC";
    if (sortBy === "id") {
        matchingMembers.sort(utils_1.sorter(m => BigInt(m.id), realSortDir));
    }
    else {
        matchingMembers.sort(utils_1.multiSorter([
            [m => m.username.toLowerCase(), realSortDir],
            [m => m.discriminator, realSortDir],
        ]));
    }
    const lastPage = Math.max(1, Math.ceil(matchingMembers.length / perPage));
    page = Math.min(lastPage, Math.max(1, page));
    const from = (page - 1) * perPage;
    const to = Math.min(from + perPage, matchingMembers.length);
    const pageMembers = matchingMembers.slice(from, to);
    return {
        results: pageMembers,
        totalResults: matchingMembers.length,
        page,
        lastPage,
        from: from + 1,
        to,
    };
}
async function performBanSearch(pluginData, args, page = 1, perPage = SEARCH_RESULTS_PER_PAGE) {
    const member = pluginData.guild.members.get(pluginData.client.user.id);
    if (member && !hasDiscordPermissions_1.hasDiscordPermissions(member.permissions, eris_1.Constants.Permissions.banMembers)) {
        throw new SearchError(`Unable to search bans: missing "Ban Members" permission`);
    }
    let matchingBans = (await pluginData.guild.getBans()).map(x => x.user);
    if (args.query) {
        let isSafeRegex = true;
        let queryRegex;
        if (args.regex) {
            const flags = args["case-sensitive"] ? "" : "i";
            queryRegex = validatorUtils_1.inputPatternToRegExp(args.query.trimStart());
            queryRegex = new RegExp(queryRegex.source, flags);
            isSafeRegex = false;
        }
        else {
            queryRegex = new RegExp(escape_string_regexp_1.default(args.query.trimStart()), args["case-sensitive"] ? "" : "i");
        }
        const execRegExp = getOptimizedRegExpRunner(pluginData, isSafeRegex);
        matchingBans = await async_1.asyncFilter(matchingBans, async (user) => {
            const fullUsername = `${user.username}#${user.discriminator}`;
            if (await execRegExp(queryRegex, fullUsername).catch(RegExpRunner_1.allowTimeout))
                return true;
            return false;
        });
    }
    const [, sortDir, sortBy] = (args.sort && args.sort.match(/^(-?)(.*)$/)) ?? [null, "ASC", "name"];
    const realSortDir = sortDir === "-" ? "DESC" : "ASC";
    if (sortBy === "id") {
        matchingBans.sort(utils_1.sorter(m => BigInt(m.id), realSortDir));
    }
    else {
        matchingBans.sort(utils_1.multiSorter([
            [m => m.username.toLowerCase(), realSortDir],
            [m => m.discriminator, realSortDir],
        ]));
    }
    const lastPage = Math.max(1, Math.ceil(matchingBans.length / perPage));
    page = Math.min(lastPage, Math.max(1, page));
    const from = (page - 1) * perPage;
    const to = Math.min(from + perPage, matchingBans.length);
    const pageMembers = matchingBans.slice(from, to);
    return {
        results: pageMembers,
        totalResults: matchingBans.length,
        page,
        lastPage,
        from: from + 1,
        to,
    };
}
function formatSearchResultList(members) {
    const longestId = members.reduce((longest, member) => Math.max(longest, member.id.length), 0);
    const lines = members.map(member => {
        const paddedId = member.id.padEnd(longestId, " ");
        let line;
        if (member instanceof eris_1.Member) {
            line = `${paddedId} ${member.user.username}#${member.user.discriminator}`;
            if (member.nick)
                line += ` (${member.nick})`;
        }
        else {
            line = `${paddedId} ${member.username}#${member.discriminator}`;
        }
        return line;
    });
    return lines.join("\n");
}
function formatSearchResultIdList(members) {
    return members.map(m => m.id).join(" ");
}
