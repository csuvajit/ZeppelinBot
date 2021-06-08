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
exports.AlertAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const eris_1 = require("eris");
const templateFormatter_1 = require("../../../templateFormatter");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
exports.AlertAction = helpers_1.automodAction({
    configType: t.type({
        channel: t.string,
        text: t.string,
        allowed_mentions: utils_1.tNormalizedNullOptional(utils_1.tAllowedMentions),
    }),
    defaultConfig: {},
    async apply({ pluginData, contexts, actionConfig, ruleName, matchResult }) {
        const channel = pluginData.guild.channels.get(actionConfig.channel);
        const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
        if (channel && channel instanceof eris_1.TextChannel) {
            const text = actionConfig.text;
            const theMessageLink = contexts[0].message && utils_1.messageLink(pluginData.guild.id, contexts[0].message.channel_id, contexts[0].message.id);
            const safeUsers = contexts.map(c => c.user && utils_1.stripObjectToScalars(c.user)).filter(Boolean);
            const safeUser = safeUsers[0];
            const actionsTaken = Object.keys(pluginData.config.get().rules[ruleName].actions).join(", ");
            const logMessage = await logs.getLogMessage(LogType_1.LogType.AUTOMOD_ACTION, {
                rule: ruleName,
                user: safeUser,
                users: safeUsers,
                actionsTaken,
                matchSummary: matchResult.summary,
            });
            let rendered;
            try {
                rendered = await templateFormatter_1.renderTemplate(actionConfig.text, {
                    rule: ruleName,
                    user: safeUser,
                    users: safeUsers,
                    text,
                    actionsTaken,
                    matchSummary: matchResult.summary,
                    messageLink: theMessageLink,
                    logMessage,
                });
            }
            catch (err) {
                if (err instanceof templateFormatter_1.TemplateParseError) {
                    pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.BOT_ALERT, {
                        body: `Error in alert format of automod rule ${ruleName}: ${err.message}`,
                    });
                    return;
                }
                throw err;
            }
            try {
                await utils_1.createChunkedMessage(channel, rendered, actionConfig.allowed_mentions);
            }
            catch (err) {
                if (err.code === 50001) {
                    logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Missing access to send alert to channel ${utils_1.verboseChannelMention(channel)} in automod rule **${ruleName}**`,
                    });
                }
                else {
                    logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Error ${err.code || "UNKNOWN"} when sending alert to channel ${utils_1.verboseChannelMention(channel)} in automod rule **${ruleName}**`,
                    });
                }
            }
        }
        else {
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Invalid channel id \`${actionConfig.channel}\` for alert action in automod rule **${ruleName}**`,
            });
        }
    },
});
