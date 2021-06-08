"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageInfoEmbed = void 0;
const eris_1 = require("eris");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const utils_1 = require("../../../utils");
const commandUtils_1 = require("knub/dist/commands/commandUtils");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const MESSAGE_ICON = "https://cdn.discordapp.com/attachments/740650744830623756/740685652152025088/message.png";
async function getMessageInfoEmbed(pluginData, channelId, messageId, requestMemberId) {
    const message = await pluginData.client.getMessage(channelId, messageId).catch(() => null);
    if (!message) {
        return null;
    }
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    const embed = {
        fields: [],
    };
    embed.author = {
        name: `Message:  ${message.id}`,
        icon_url: MESSAGE_ICON,
    };
    const createdAt = moment_timezone_1.default.utc(message.createdAt, "x");
    const tzCreatedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
        : timeAndDate.inGuildTz(createdAt);
    const prettyCreatedAt = tzCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const messageAge = humanize_duration_1.default(Date.now() - message.createdAt, {
        largest: 2,
        round: true,
    });
    const editedAt = message.editedTimestamp && moment_timezone_1.default.utc(message.editedTimestamp, "x");
    const tzEditedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, editedAt)
        : timeAndDate.inGuildTz(editedAt);
    const prettyEditedAt = tzEditedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const editAge = message.editedTimestamp &&
        humanize_duration_1.default(Date.now() - message.editedTimestamp, {
            largest: 2,
            round: true,
        });
    const type = {
        [eris_1.Constants.MessageTypes.DEFAULT]: "Regular message",
        [eris_1.Constants.MessageTypes.CHANNEL_PINNED_MESSAGE]: "System message",
        [eris_1.Constants.MessageTypes.GUILD_MEMBER_JOIN]: "System message",
        [eris_1.Constants.MessageTypes.USER_PREMIUM_GUILD_SUBSCRIPTION]: "System message",
        [eris_1.Constants.MessageTypes.USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1]: "System message",
        [eris_1.Constants.MessageTypes.USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2]: "System message",
        [eris_1.Constants.MessageTypes.USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3]: "System message",
        [eris_1.Constants.MessageTypes.CHANNEL_FOLLOW_ADD]: "System message",
        [eris_1.Constants.MessageTypes.GUILD_DISCOVERY_DISQUALIFIED]: "System message",
        [eris_1.Constants.MessageTypes.GUILD_DISCOVERY_REQUALIFIED]: "System message",
    }[message.type] || "Unknown";
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Message information",
        value: utils_1.trimEmptyLines(utils_1.trimLines(`
      ID: \`${message.id}\`
      Channel: <#${message.channel.id}>
      Channel ID: \`${message.channel.id}\`
      Created: **${messageAge} ago** (\`${prettyCreatedAt}\`)
      ${editedAt ? `Edited at: **${editAge} ago** (\`${prettyEditedAt}\`)` : ""}
      Type: **${type}**
      Link: [**Go to message ➔**](${utils_1.messageLink(pluginData.guild.id, message.channel.id, message.id)})
    `)),
    });
    const authorCreatedAt = moment_timezone_1.default.utc(message.author.createdAt, "x");
    const tzAuthorCreatedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, authorCreatedAt)
        : timeAndDate.inGuildTz(authorCreatedAt);
    const prettyAuthorCreatedAt = tzAuthorCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const authorAccountAge = humanize_duration_1.default(Date.now() - message.author.createdAt, {
        largest: 2,
        round: true,
    });
    const authorJoinedAt = message.member && moment_timezone_1.default.utc(message.member.joinedAt, "x");
    const tzAuthorJoinedAt = authorJoinedAt
        ? requestMemberId
            ? await timeAndDate.inMemberTz(requestMemberId, authorJoinedAt)
            : timeAndDate.inGuildTz(authorJoinedAt)
        : null;
    const prettyAuthorJoinedAt = tzAuthorJoinedAt?.format(timeAndDate.getDateFormat("pretty_datetime"));
    const authorServerAge = message.member &&
        humanize_duration_1.default(Date.now() - message.member.joinedAt, {
            largest: 2,
            round: true,
        });
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Author information",
        value: utils_1.trimLines(`
      Name: **${message.author.username}#${message.author.discriminator}**
      ID: \`${message.author.id}\`
      Created: **${authorAccountAge} ago** (\`${prettyAuthorCreatedAt}\`)
      ${authorJoinedAt ? `Joined: **${authorServerAge} ago** (\`${prettyAuthorJoinedAt}\`)` : ""}
      Mention: <@!${message.author.id}>
    `),
    });
    const textContent = message.content || "<no text content>";
    const chunked = utils_1.chunkMessageLines(textContent, 1014);
    for (const [i, chunk] of chunked.entries()) {
        embed.fields.push({
            name: i === 0 ? utils_1.preEmbedPadding + "Text content" : "[...]",
            value: chunk,
        });
    }
    if (message.attachments.length) {
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Attachments",
            value: message.attachments[0].url,
        });
    }
    if (message.embeds.length) {
        const prefix = pluginData.fullConfig.prefix || commandUtils_1.getDefaultPrefix(pluginData.client);
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Embeds",
            value: `Message contains an embed, use \`${prefix}source\` to see the embed source`,
        });
    }
    return embed;
}
exports.getMessageInfoEmbed = getMessageInfoEmbed;
