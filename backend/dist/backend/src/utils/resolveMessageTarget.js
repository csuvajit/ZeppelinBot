"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMessageTarget = void 0;
const utils_1 = require("../utils");
const getChannelIdFromMessageId_1 = require("../data/getChannelIdFromMessageId");
const eris_1 = require("eris");
const channelAndMessageIdRegex = /^(\d+)[\-\/](\d+)$/;
const messageLinkRegex = /^https:\/\/(?:\w+\.)?discord(?:app)?\.com\/channels\/\d+\/(\d+)\/(\d+)$/i;
async function resolveMessageTarget(pluginData, value) {
    const result = await (async () => {
        if (utils_1.isSnowflake(value)) {
            const channelId = await getChannelIdFromMessageId_1.getChannelIdFromMessageId(value);
            if (!channelId) {
                return null;
            }
            return {
                channelId,
                messageId: value,
            };
        }
        const channelAndMessageIdMatch = value.match(channelAndMessageIdRegex);
        if (channelAndMessageIdMatch) {
            return {
                channelId: channelAndMessageIdMatch[1],
                messageId: channelAndMessageIdMatch[2],
            };
        }
        const messageLinkMatch = value.match(messageLinkRegex);
        if (messageLinkMatch) {
            return {
                channelId: messageLinkMatch[1],
                messageId: messageLinkMatch[2],
            };
        }
    })();
    if (!result) {
        return null;
    }
    const channel = pluginData.guild.channels.get(result.channelId);
    if (!channel || !(channel instanceof eris_1.TextChannel)) {
        return null;
    }
    return {
        channel,
        messageId: result.messageId,
    };
}
exports.resolveMessageTarget = resolveMessageTarget;
