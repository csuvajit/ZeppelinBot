"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFiltersToMsg = void 0;
const Zalgo_1 = require("../../../data/Zalgo");
const utils_1 = require("../../../utils");
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const censorMessage_1 = require("./censorMessage");
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const RegExpRunner_1 = require("../../../RegExpRunner");
async function applyFiltersToMsg(pluginData, savedMessage) {
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, savedMessage.user_id);
    const config = await pluginData.config.getMatchingConfig({ member, channelId: savedMessage.channel_id });
    let messageContent = savedMessage.data.content || "";
    if (savedMessage.data.attachments)
        messageContent += " " + JSON.stringify(savedMessage.data.attachments);
    if (savedMessage.data.embeds) {
        const embeds = savedMessage.data.embeds.map(e => lodash_clonedeep_1.default(e));
        for (const embed of embeds) {
            if (embed.type === "video") {
                // Ignore video descriptions as they're not actually shown on the embed
                delete embed.description;
            }
        }
        messageContent += " " + JSON.stringify(embeds);
    }
    // Filter zalgo
    const filterZalgo = config.filter_zalgo;
    if (filterZalgo) {
        const result = Zalgo_1.ZalgoRegex.exec(messageContent);
        if (result) {
            censorMessage_1.censorMessage(pluginData, savedMessage, "zalgo detected");
            return true;
        }
    }
    // Filter invites
    const filterInvites = config.filter_invites;
    if (filterInvites) {
        const inviteGuildWhitelist = config.invite_guild_whitelist;
        const inviteGuildBlacklist = config.invite_guild_blacklist;
        const inviteCodeWhitelist = config.invite_code_whitelist;
        const inviteCodeBlacklist = config.invite_code_blacklist;
        const allowGroupDMInvites = config.allow_group_dm_invites;
        const inviteCodes = utils_1.getInviteCodesInString(messageContent);
        const invites = await Promise.all(inviteCodes.map(code => utils_1.resolveInvite(pluginData.client, code)));
        for (const invite of invites) {
            // Always filter unknown invites if invite filtering is enabled
            if (invite == null) {
                censorMessage_1.censorMessage(pluginData, savedMessage, `unknown invite not found in whitelist`);
                return true;
            }
            if (!utils_1.isGuildInvite(invite) && !allowGroupDMInvites) {
                censorMessage_1.censorMessage(pluginData, savedMessage, `group dm invites are not allowed`);
                return true;
            }
            if (utils_1.isGuildInvite(invite)) {
                if (inviteGuildWhitelist && !inviteGuildWhitelist.includes(invite.guild.id)) {
                    censorMessage_1.censorMessage(pluginData, savedMessage, `invite guild (**${invite.guild.name}** \`${invite.guild.id}\`) not found in whitelist`);
                    return true;
                }
                if (inviteGuildBlacklist && inviteGuildBlacklist.includes(invite.guild.id)) {
                    censorMessage_1.censorMessage(pluginData, savedMessage, `invite guild (**${invite.guild.name}** \`${invite.guild.id}\`) found in blacklist`);
                    return true;
                }
            }
            if (inviteCodeWhitelist && !inviteCodeWhitelist.includes(invite.code)) {
                censorMessage_1.censorMessage(pluginData, savedMessage, `invite code (\`${invite.code}\`) not found in whitelist`);
                return true;
            }
            if (inviteCodeBlacklist && inviteCodeBlacklist.includes(invite.code)) {
                censorMessage_1.censorMessage(pluginData, savedMessage, `invite code (\`${invite.code}\`) found in blacklist`);
                return true;
            }
        }
    }
    // Filter domains
    const filterDomains = config.filter_domains;
    if (filterDomains) {
        const domainWhitelist = config.domain_whitelist;
        const domainBlacklist = config.domain_blacklist;
        const urls = utils_1.getUrlsInString(messageContent);
        for (const thisUrl of urls) {
            if (domainWhitelist && !domainWhitelist.includes(thisUrl.hostname)) {
                censorMessage_1.censorMessage(pluginData, savedMessage, `domain (\`${thisUrl.hostname}\`) not found in whitelist`);
                return true;
            }
            if (domainBlacklist && domainBlacklist.includes(thisUrl.hostname)) {
                censorMessage_1.censorMessage(pluginData, savedMessage, `domain (\`${thisUrl.hostname}\`) found in blacklist`);
                return true;
            }
        }
    }
    // Filter tokens
    const blockedTokens = config.blocked_tokens || [];
    for (const token of blockedTokens) {
        if (messageContent.toLowerCase().includes(token.toLowerCase())) {
            censorMessage_1.censorMessage(pluginData, savedMessage, `blocked token (\`${token}\`) found`);
            return true;
        }
    }
    // Filter words
    const blockedWords = config.blocked_words || [];
    for (const word of blockedWords) {
        const regex = new RegExp(`\\b${escape_string_regexp_1.default(word)}\\b`, "i");
        if (regex.test(messageContent)) {
            censorMessage_1.censorMessage(pluginData, savedMessage, `blocked word (\`${word}\`) found`);
            return true;
        }
    }
    // Filter regex
    for (const regex of config.blocked_regex || []) {
        // We're testing both the original content and content + attachments/embeds here so regexes that use ^ and $ still match the regular content properly
        const matches = (await pluginData.state.regexRunner.exec(regex, savedMessage.data.content).catch(RegExpRunner_1.allowTimeout)) ||
            (await pluginData.state.regexRunner.exec(regex, messageContent).catch(RegExpRunner_1.allowTimeout));
        if (matches) {
            censorMessage_1.censorMessage(pluginData, savedMessage, `blocked regex (\`${regex.source}\`) found`);
            return true;
        }
    }
    return false;
}
exports.applyFiltersToMsg = applyFiltersToMsg;
