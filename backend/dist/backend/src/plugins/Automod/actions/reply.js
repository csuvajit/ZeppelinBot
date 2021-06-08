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
exports.ReplyAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const eris_1 = require("eris");
const templateFormatter_1 = require("../../../templateFormatter");
const hasDiscordPermissions_1 = require("../../../utils/hasDiscordPermissions");
const LogType_1 = require("../../../data/LogType");
exports.ReplyAction = helpers_1.automodAction({
    configType: t.union([
        t.string,
        t.type({
            text: utils_1.tMessageContent,
            auto_delete: utils_1.tNullable(t.union([utils_1.tDelayString, t.number])),
        }),
    ]),
    defaultConfig: {},
    async apply({ pluginData, contexts, actionConfig, ruleName }) {
        const contextsWithTextChannels = contexts
            .filter(c => c.message?.channel_id)
            .filter(c => pluginData.guild.channels.get(c.message.channel_id) instanceof eris_1.TextChannel);
        const contextsByChannelId = contextsWithTextChannels.reduce((map, context) => {
            if (!map.has(context.message.channel_id)) {
                map.set(context.message.channel_id, []);
            }
            map.get(context.message.channel_id).push(context);
            return map;
        }, new Map());
        for (const [channelId, _contexts] of contextsByChannelId.entries()) {
            const users = utils_1.unique(Array.from(new Set(_contexts.map(c => c.user).filter(Boolean))));
            const user = users[0];
            const renderReplyText = async (str) => templateFormatter_1.renderTemplate(str, {
                user: utils_1.stripObjectToScalars(user),
            });
            const formatted = typeof actionConfig === "string"
                ? await renderReplyText(actionConfig)
                : (await utils_1.renderRecursively(actionConfig.text, renderReplyText));
            if (formatted) {
                const channel = pluginData.guild.channels.get(channelId);
                // Check for basic Send Messages and View Channel permissions
                if (!hasDiscordPermissions_1.hasDiscordPermissions(channel.permissionsOf(pluginData.client.user.id), eris_1.Constants.Permissions.sendMessages | eris_1.Constants.Permissions.readMessages)) {
                    pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Missing permissions to reply in ${utils_1.verboseChannelMention(channel)} in Automod rule \`${ruleName}\``,
                    });
                    continue;
                }
                // If the message is an embed, check for embed permissions
                if (typeof formatted !== "string" &&
                    !hasDiscordPermissions_1.hasDiscordPermissions(channel.permissionsOf(pluginData.client.user.id), eris_1.Constants.Permissions.embedLinks)) {
                    pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Missing permissions to reply **with an embed** in ${utils_1.verboseChannelMention(channel)} in Automod rule \`${ruleName}\``,
                    });
                    continue;
                }
                const messageContent = typeof formatted === "string" ? { content: formatted } : formatted;
                const replyMsg = await channel.createMessage({
                    ...messageContent,
                    allowedMentions: {
                        users: [user.id],
                    },
                });
                if (typeof actionConfig === "object" && actionConfig.auto_delete) {
                    const delay = utils_1.convertDelayStringToMS(String(actionConfig.auto_delete));
                    setTimeout(() => replyMsg.delete().catch(utils_1.noop), delay);
                }
            }
        }
    },
});
