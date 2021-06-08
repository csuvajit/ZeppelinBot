"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelInfoEmbed = void 0;
const eris_1 = require("eris");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const utils_1 = require("../../../utils");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const TEXT_CHANNEL_ICON = "https://cdn.discordapp.com/attachments/740650744830623756/740656843545772062/text-channel.png";
const VOICE_CHANNEL_ICON = "https://cdn.discordapp.com/attachments/740650744830623756/740656845982662716/voice-channel.png";
const ANNOUNCEMENT_CHANNEL_ICON = "https://cdn.discordapp.com/attachments/740650744830623756/740656841687564348/announcement-channel.png";
const STAGE_CHANNEL_ICON = "https://cdn.discordapp.com/attachments/740650744830623756/839930647711186995/stage-channel.png";
async function getChannelInfoEmbed(pluginData, channelId, requestMemberId) {
    const channel = pluginData.guild.channels.get(channelId);
    if (!channel) {
        return null;
    }
    const embed = {
        fields: [],
    };
    let icon = TEXT_CHANNEL_ICON;
    if (channel.type === eris_1.Constants.ChannelTypes.GUILD_VOICE) {
        icon = VOICE_CHANNEL_ICON;
    }
    else if (channel.type === eris_1.Constants.ChannelTypes.GUILD_NEWS) {
        icon = ANNOUNCEMENT_CHANNEL_ICON;
    }
    else if (channel.type === eris_1.Constants.ChannelTypes.GUILD_STAGE) {
        icon = STAGE_CHANNEL_ICON;
    }
    const channelType = {
        [eris_1.Constants.ChannelTypes.GUILD_TEXT]: "Text channel",
        [eris_1.Constants.ChannelTypes.GUILD_VOICE]: "Voice channel",
        [eris_1.Constants.ChannelTypes.GUILD_CATEGORY]: "Category",
        [eris_1.Constants.ChannelTypes.GUILD_NEWS]: "Announcement channel",
        [eris_1.Constants.ChannelTypes.GUILD_STORE]: "Store channel",
        [eris_1.Constants.ChannelTypes.GUILD_STAGE]: "Stage channel",
    }[channel.type] || "Channel";
    embed.author = {
        name: `${channelType}:  ${channel.name}`,
        icon_url: icon,
    };
    let channelName = `#${channel.name}`;
    if (channel.type === eris_1.Constants.ChannelTypes.GUILD_VOICE ||
        channel.type === eris_1.Constants.ChannelTypes.GUILD_CATEGORY ||
        channel.type === eris_1.Constants.ChannelTypes.GUILD_STAGE) {
        channelName = channel.name;
    }
    const createdAt = moment_timezone_1.default.utc(channel.createdAt, "x");
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    const tzCreatedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
        : timeAndDate.inGuildTz(createdAt);
    const prettyCreatedAt = tzCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const channelAge = humanize_duration_1.default(Date.now() - channel.createdAt, {
        largest: 2,
        round: true,
    });
    const showMention = channel.type !== eris_1.Constants.ChannelTypes.GUILD_CATEGORY;
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Channel information",
        value: utils_1.trimLines(`
      Name: **${channelName}**
      ID: \`${channel.id}\`
      Created: **${channelAge} ago** (\`${prettyCreatedAt}\`)
      Type: **${channelType}**
      ${showMention ? `Mention: <#${channel.id}>` : ""}
    `),
    });
    if (channel.type === eris_1.Constants.ChannelTypes.GUILD_VOICE || channel.type === eris_1.Constants.ChannelTypes.GUILD_STAGE) {
        const voiceMembers = Array.from(channel.voiceMembers.values());
        const muted = voiceMembers.filter(vm => vm.voiceState.mute || vm.voiceState.selfMute);
        const deafened = voiceMembers.filter(vm => vm.voiceState.deaf || vm.voiceState.selfDeaf);
        const voiceOrStage = channel.type === eris_1.Constants.ChannelTypes.GUILD_VOICE ? "Voice" : "Stage";
        embed.fields.push({
            name: utils_1.preEmbedPadding + `${voiceOrStage} information`,
            value: utils_1.trimLines(`
        Users on ${voiceOrStage.toLowerCase()} channel: **${utils_1.formatNumber(voiceMembers.length)}**
        Muted: **${utils_1.formatNumber(muted.length)}**
        Deafened: **${utils_1.formatNumber(deafened.length)}**
      `),
        });
    }
    if (channel.type === eris_1.Constants.ChannelTypes.GUILD_CATEGORY) {
        const textChannels = pluginData.guild.channels.filter(ch => ch.parentID === channel.id && ch.type !== eris_1.Constants.ChannelTypes.GUILD_VOICE);
        const voiceChannels = pluginData.guild.channels.filter(ch => ch.parentID === channel.id &&
            (ch.type === eris_1.Constants.ChannelTypes.GUILD_VOICE || ch.type === eris_1.Constants.ChannelTypes.GUILD_STAGE));
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Category information",
            value: utils_1.trimLines(`
        Text channels: **${textChannels.length}**
        Voice channels: **${voiceChannels.length}**
      `),
        });
    }
    return embed;
}
exports.getChannelInfoEmbed = getChannelInfoEmbed;
