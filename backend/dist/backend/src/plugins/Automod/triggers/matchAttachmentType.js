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
exports.MatchAttachmentTypeTrigger = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
exports.MatchAttachmentTypeTrigger = helpers_1.automodTrigger()({
    configType: t.type({
        filetype_blacklist: t.array(t.string),
        blacklist_enabled: t.boolean,
        filetype_whitelist: t.array(t.string),
        whitelist_enabled: t.boolean,
    }),
    defaultConfig: {
        filetype_blacklist: [],
        blacklist_enabled: false,
        filetype_whitelist: [],
        whitelist_enabled: false,
    },
    async match({ pluginData, context, triggerConfig: trigger }) {
        if (!context.message) {
            return;
        }
        if (!context.message.data.attachments)
            return null;
        const attachments = context.message.data.attachments;
        for (const attachment of attachments) {
            const attachmentType = attachment.filename
                .split(".")
                .pop()
                .toLowerCase();
            const blacklist = trigger.blacklist_enabled
                ? (trigger.filetype_blacklist || []).map(_t => _t.toLowerCase())
                : null;
            if (blacklist && blacklist.includes(attachmentType)) {
                return {
                    extra: {
                        matchedType: attachmentType,
                        mode: "blacklist",
                    },
                };
            }
            const whitelist = trigger.whitelist_enabled
                ? (trigger.filetype_whitelist || []).map(_t => _t.toLowerCase())
                : null;
            if (whitelist && !whitelist.includes(attachmentType)) {
                return {
                    extra: {
                        matchedType: attachmentType,
                        mode: "whitelist",
                    },
                };
            }
        }
        return null;
    },
    renderMatchInformation({ pluginData, contexts, matchResult }) {
        const channel = pluginData.guild.channels.get(contexts[0].message.channel_id);
        const prettyChannel = utils_1.verboseChannelMention(channel);
        return (utils_1.asSingleLine(`
        Matched attachment type \`${utils_1.disableInlineCode(matchResult.extra.matchedType)}\`
        (${matchResult.extra.mode === "blacklist" ? "(blacklisted)" : "(not in whitelist)"})
        in message (\`${contexts[0].message.id}\`) in ${prettyChannel}:
      `) + utils_1.messageSummary(contexts[0].message));
    },
});
