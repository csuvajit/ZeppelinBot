"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutesCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanizeDurationShort_1 = require("../../../humanizeDurationShort");
const pluginUtils_1 = require("../../../pluginUtils");
exports.MutesCmd = types_1.mutesCmd({
    trigger: "mutes",
    permission: "can_view_list",
    signature: {
        age: commandTypes_1.commandTypeHelpers.delay({
            option: true,
            shortcut: "a",
        }),
        left: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "l" }),
        manual: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "m" }),
        export: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "e" }),
    },
    async run({ pluginData, message: msg, args }) {
        const listMessagePromise = msg.channel.createMessage("Loading mutes...");
        const mutesPerPage = 10;
        let totalMutes = 0;
        let hasFilters = false;
        let hasReactions = false;
        let clearReactionsFn;
        let clearReactionsTimeout;
        const clearReactionsDebounce = 5 * utils_1.MINUTES;
        let lines = [];
        // Active, logged mutes
        const activeMutes = await pluginData.state.mutes.getActiveMutes();
        activeMutes.sort((a, b) => {
            if (a.expires_at == null && b.expires_at != null)
                return 1;
            if (b.expires_at == null && a.expires_at != null)
                return -1;
            if (a.expires_at == null && b.expires_at == null) {
                return a.created_at > b.created_at ? -1 : 1;
            }
            return a.expires_at > b.expires_at ? 1 : -1;
        });
        if (args.manual) {
            // Show only manual mutes (i.e. "Muted" role added without a logged mute)
            const muteUserIds = new Set(activeMutes.map(m => m.user_id));
            const manuallyMutedMembers = [];
            const muteRole = pluginData.config.get().mute_role;
            if (muteRole) {
                pluginData.guild.members.forEach(member => {
                    if (muteUserIds.has(member.id))
                        return;
                    if (member.roles.includes(muteRole))
                        manuallyMutedMembers.push(member);
                });
            }
            totalMutes = manuallyMutedMembers.length;
            lines = manuallyMutedMembers.map(member => {
                return `<@!${member.id}> (**${member.user.username}#${member.user.discriminator}**, \`${member.id}\`)   🔧 Manual mute`;
            });
        }
        else {
            // Show filtered active mutes (but not manual mutes)
            let filteredMutes = activeMutes;
            let bannedIds = null;
            // Filter: mute age
            if (args.age) {
                const cutoff = moment_timezone_1.default
                    .utc()
                    .subtract(args.age, "ms")
                    .format(utils_1.DBDateFormat);
                filteredMutes = filteredMutes.filter(m => m.created_at <= cutoff);
                hasFilters = true;
            }
            // Fetch some extra details for each mute: the muted member, and whether they've been banned
            for (const [index, mute] of filteredMutes.entries()) {
                const muteWithDetails = { ...mute };
                const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, mute.user_id);
                if (!member) {
                    if (!bannedIds) {
                        const bans = await pluginData.guild.getBans();
                        bannedIds = bans.map(u => u.user.id);
                    }
                    muteWithDetails.banned = bannedIds.includes(mute.user_id);
                }
                else {
                    muteWithDetails.member = member;
                }
                filteredMutes[index] = muteWithDetails;
            }
            // Filter: left the server
            if (args.left != null) {
                filteredMutes = filteredMutes.filter(m => (args.left && !m.member) || (!args.left && m.member));
                hasFilters = true;
            }
            totalMutes = filteredMutes.length;
            // Create a message line for each mute
            const caseIds = filteredMutes.map(m => m.case_id).filter(v => !!v);
            const muteCases = caseIds.length ? await pluginData.state.cases.get(caseIds) : [];
            const muteCasesById = muteCases.reduce((map, c) => map.set(c.id, c), new Map());
            lines = filteredMutes.map(mute => {
                const user = pluginData.client.users.get(mute.user_id);
                const username = user ? `${user.username}#${user.discriminator}` : "Unknown#0000";
                const theCase = muteCasesById.get(mute.case_id);
                const caseName = theCase ? `Case #${theCase.case_number}` : "No case";
                let line = `<@!${mute.user_id}> (**${username}**, \`${mute.user_id}\`)   📋 ${caseName}`;
                if (mute.expires_at) {
                    const timeUntilExpiry = moment_timezone_1.default.utc().diff(moment_timezone_1.default.utc(mute.expires_at, utils_1.DBDateFormat));
                    const humanizedTime = humanizeDurationShort_1.humanizeDurationShort(timeUntilExpiry, { largest: 2, round: true });
                    line += `   ⏰ Expires in ${humanizedTime}`;
                }
                else {
                    line += `   ⏰ Indefinite`;
                }
                const timeFromMute = moment_timezone_1.default.utc(mute.created_at, utils_1.DBDateFormat).diff(moment_timezone_1.default.utc());
                const humanizedTimeFromMute = humanizeDurationShort_1.humanizeDurationShort(timeFromMute, { largest: 2, round: true });
                line += `   🕒 Muted ${humanizedTimeFromMute} ago`;
                if (mute.banned) {
                    line += `   🔨 Banned`;
                }
                else if (!mute.member) {
                    line += `   ❌ Left server`;
                }
                return line;
            });
        }
        const listMessage = await listMessagePromise;
        let currentPage = 1;
        const totalPages = Math.ceil(lines.length / mutesPerPage);
        const drawListPage = async (page) => {
            page = Math.max(1, Math.min(totalPages, page));
            currentPage = page;
            const pageStart = (page - 1) * mutesPerPage;
            const pageLines = lines.slice(pageStart, pageStart + mutesPerPage);
            const pageRangeText = `${pageStart + 1}–${pageStart + pageLines.length} of ${totalMutes}`;
            let message;
            if (args.manual) {
                message = `Showing manual mutes ${pageRangeText}:`;
            }
            else if (hasFilters) {
                message = `Showing filtered active mutes ${pageRangeText}:`;
            }
            else {
                message = `Showing active mutes ${pageRangeText}:`;
            }
            message += "\n\n" + pageLines.join("\n");
            listMessage.edit(message);
            bumpClearReactionsTimeout();
        };
        const bumpClearReactionsTimeout = () => {
            if (!hasReactions)
                return;
            clearTimeout(clearReactionsTimeout);
            clearReactionsTimeout = setTimeout(clearReactionsFn, clearReactionsDebounce);
        };
        if (totalMutes === 0) {
            if (args.manual) {
                listMessage.edit("No manual mutes found!");
            }
            else if (hasFilters) {
                listMessage.edit("No mutes found with the specified filters!");
            }
            else {
                listMessage.edit("No active mutes!");
            }
        }
        else if (args.export) {
            const archiveId = await pluginData.state.archives.create(lines.join("\n"), moment_timezone_1.default.utc().add(1, "hour"));
            const baseUrl = pluginUtils_1.getBaseUrl(pluginData);
            const url = await pluginData.state.archives.getUrl(baseUrl, archiveId);
            await listMessage.edit(`Exported mutes: ${url}`);
        }
        else {
            drawListPage(1);
            if (totalPages > 1) {
                hasReactions = true;
                listMessage.addReaction("⬅");
                listMessage.addReaction("➡");
                const paginationReactionListener = pluginData.events.on("messageReactionAdd", ({ args: { message: rMsg, emoji, member } }) => {
                    if (!utils_1.isFullMessage(rMsg))
                        return;
                    if (rMsg.id !== listMessage.id)
                        return;
                    if (member.id !== msg.author.id)
                        return;
                    if (!["⬅", "➡"].includes(emoji.name))
                        return;
                    if (emoji.name === "⬅" && currentPage > 1) {
                        drawListPage(currentPage - 1);
                    }
                    else if (emoji.name === "➡" && currentPage < totalPages) {
                        drawListPage(currentPage + 1);
                    }
                    rMsg.removeReaction(emoji.name, member.id).catch(utils_1.noop);
                });
                clearReactionsFn = () => {
                    listMessage.removeReactions().catch(utils_1.noop);
                    pluginData.events.off("messageReactionAdd", paginationReactionListener);
                };
                bumpClearReactionsTimeout();
            }
        }
    },
});
