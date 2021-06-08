"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextMatchPartialSummary = void 0;
const utils_1 = require("../../../utils");
function getTextMatchPartialSummary(pluginData, type, context) {
    if (type === "message") {
        const message = context.message;
        const channel = pluginData.guild.channels.get(message.channel_id);
        const channelMention = channel ? utils_1.verboseChannelMention(channel) : `\`#${message.channel_id}\``;
        return `message in ${channelMention}:\n${utils_1.messageSummary(message)}`;
    }
    else if (type === "embed") {
        const message = context.message;
        const channel = pluginData.guild.channels.get(message.channel_id);
        const channelMention = channel ? utils_1.verboseChannelMention(channel) : `\`#${message.channel_id}\``;
        return `message embed in ${channelMention}:\n${utils_1.messageSummary(message)}`;
    }
    else if (type === "username") {
        return `username: ${context.user.username}`;
    }
    else if (type === "nickname") {
        return `nickname: ${context.member.nick}`;
    }
    else if (type === "visiblename") {
        const visibleName = context.member?.nick || context.user.username;
        return `visible name: ${visibleName}`;
    }
    else if (type === "customstatus") {
        return `custom status: ${context.member.game.state}`;
    }
}
exports.getTextMatchPartialSummary = getTextMatchPartialSummary;
