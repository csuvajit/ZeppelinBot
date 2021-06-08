"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchInvitesTrigger = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const matchMultipleTextTypesOnMessage_1 = require("../functions/matchMultipleTextTypesOnMessage");
const getTextMatchPartialSummary_1 = require("../functions/getTextMatchPartialSummary");
exports.MatchInvitesTrigger = helpers_1.automodTrigger()({
    configType: t.type({
        include_guilds: utils_1.tNullable(t.array(t.string)),
        exclude_guilds: utils_1.tNullable(t.array(t.string)),
        include_invite_codes: utils_1.tNullable(t.array(t.string)),
        exclude_invite_codes: utils_1.tNullable(t.array(t.string)),
        allow_group_dm_invites: t.boolean,
        match_messages: t.boolean,
        match_embeds: t.boolean,
        match_visible_names: t.boolean,
        match_usernames: t.boolean,
        match_nicknames: t.boolean,
        match_custom_status: t.boolean,
    }),
    defaultConfig: {
        allow_group_dm_invites: false,
        match_messages: true,
        match_embeds: false,
        match_visible_names: false,
        match_usernames: false,
        match_nicknames: false,
        match_custom_status: false,
    },
    async match({ pluginData, context, triggerConfig: trigger }) {
        if (!context.message) {
            return;
        }
        for await (const [type, str] of matchMultipleTextTypesOnMessage_1.matchMultipleTextTypesOnMessage(pluginData, trigger, context.message)) {
            const inviteCodes = utils_1.getInviteCodesInString(str);
            if (inviteCodes.length === 0)
                continue;
            const uniqueInviteCodes = Array.from(new Set(inviteCodes));
            for (const code of uniqueInviteCodes) {
                if (trigger.include_invite_codes && trigger.include_invite_codes.includes(code)) {
                    return { extra: { type, code } };
                }
                if (trigger.exclude_invite_codes && !trigger.exclude_invite_codes.includes(code)) {
                    return { extra: { type, code } };
                }
            }
            for (const code of uniqueInviteCodes) {
                const invite = await utils_1.resolveInvite(pluginData.client, code);
                if (!invite || !utils_1.isGuildInvite(invite))
                    return { extra: { type, code } };
                if (trigger.include_guilds && trigger.include_guilds.includes(invite.guild.id)) {
                    return { extra: { type, code, invite } };
                }
                if (trigger.exclude_guilds && !trigger.exclude_guilds.includes(invite.guild.id)) {
                    return { extra: { type, code, invite } };
                }
            }
        }
        return null;
    },
    renderMatchInformation({ pluginData, contexts, matchResult }) {
        let matchedText;
        if (matchResult.extra.invite) {
            const invite = matchResult.extra.invite;
            matchedText = `invite code \`${matchResult.extra.code}\` (**${invite.guild.name}**, \`${invite.guild.id}\`)`;
        }
        else {
            matchedText = `invite code \`${matchResult.extra.code}\``;
        }
        const partialSummary = getTextMatchPartialSummary_1.getTextMatchPartialSummary(pluginData, matchResult.extra.type, contexts[0]);
        return `Matched ${matchedText} in ${partialSummary}`;
    },
});
