"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInviteInfoEmbed = void 0;
const eris_1 = require("eris");
const snowflakeToTimestamp_1 = require("../../../utils/snowflakeToTimestamp");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const utils_1 = require("../../../utils");
async function getInviteInfoEmbed(pluginData, inviteCode) {
    const invite = await utils_1.resolveInvite(pluginData.client, inviteCode, true);
    if (!invite) {
        return null;
    }
    if (utils_1.isGuildInvite(invite)) {
        const embed = {
            fields: [],
        };
        embed.author = {
            name: `Server invite:  ${invite.guild.name}`,
            url: `https://discord.gg/${invite.code}`,
        };
        if (invite.guild.icon) {
            embed.author.icon_url = `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png?size=256`;
        }
        if (invite.guild.description) {
            embed.description = invite.guild.description;
        }
        const serverCreatedAtTimestamp = snowflakeToTimestamp_1.snowflakeToTimestamp(invite.guild.id);
        const serverCreatedAt = moment_timezone_1.default.utc(serverCreatedAtTimestamp, "x");
        const serverAge = humanize_duration_1.default(Date.now() - serverCreatedAtTimestamp, {
            largest: 2,
            round: true,
        });
        const memberCount = utils_1.inviteHasCounts(invite) ? invite.memberCount : 0;
        const presenceCount = utils_1.inviteHasCounts(invite) ? invite.presenceCount : 0;
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Server information",
            value: utils_1.trimLines(`
        Name: **${invite.guild.name}**
        ID: \`${invite.guild.id}\`
        Created: **${serverAge} ago**
        Members: **${utils_1.formatNumber(memberCount)}** (${utils_1.formatNumber(presenceCount)} online)
      `),
            inline: true,
        });
        const channelName = invite.channel.type === eris_1.Constants.ChannelTypes.GUILD_VOICE
            ? `🔉 ${invite.channel.name}`
            : `#${invite.channel.name}`;
        const channelCreatedAtTimestamp = snowflakeToTimestamp_1.snowflakeToTimestamp(invite.channel.id);
        const channelCreatedAt = moment_timezone_1.default.utc(channelCreatedAtTimestamp, "x");
        const channelAge = humanize_duration_1.default(Date.now() - channelCreatedAtTimestamp, {
            largest: 2,
            round: true,
        });
        let channelInfo = utils_1.trimLines(`
        Name: **${channelName}**
        ID: \`${invite.channel.id}\`
        Created: **${channelAge} ago**
    `);
        if (invite.channel.type !== eris_1.Constants.ChannelTypes.GUILD_VOICE) {
            channelInfo += `\nMention: <#${invite.channel.id}>`;
        }
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Channel information",
            value: channelInfo,
            inline: true,
        });
        if (invite.inviter) {
            embed.fields.push({
                name: utils_1.preEmbedPadding + "Invite creator",
                value: utils_1.trimLines(`
          Name: **${invite.inviter.username}#${invite.inviter.discriminator}**
          ID: \`${invite.inviter.id}\`
          Mention: <@!${invite.inviter.id}>
        `),
            });
        }
        return embed;
    }
    if (utils_1.isGroupDMInvite(invite)) {
        const embed = {
            fields: [],
        };
        embed.author = {
            name: invite.channel.name ? `Group DM invite:  ${invite.channel.name}` : `Group DM invite`,
            url: `https://discord.gg/${invite.code}`,
        };
        if (invite.channel.icon) {
            embed.author.icon_url = `https://cdn.discordapp.com/channel-icons/${invite.channel.id}/${invite.channel.icon}.png?size=256`;
        }
        const channelCreatedAtTimestamp = snowflakeToTimestamp_1.snowflakeToTimestamp(invite.channel.id);
        const channelCreatedAt = moment_timezone_1.default.utc(channelCreatedAtTimestamp, "x");
        const channelAge = humanize_duration_1.default(Date.now() - channelCreatedAtTimestamp, {
            largest: 2,
            round: true,
        });
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Group DM information",
            value: utils_1.trimLines(`
        Name: ${invite.channel.name ? `**${invite.channel.name}**` : `_Unknown_`}
        ID: \`${invite.channel.id}\`
        Created: **${channelAge} ago**
        Members: **${utils_1.formatNumber(invite.memberCount)}**
      `),
            inline: true,
        });
        if (invite.inviter) {
            embed.fields.push({
                name: utils_1.preEmbedPadding + "Invite creator",
                value: utils_1.trimLines(`
          Name: **${invite.inviter.username}#${invite.inviter.discriminator}**
          ID: \`${invite.inviter.id}\`
          Mention: <@!${invite.inviter.id}>
        `),
                inline: true,
            });
        }
        return embed;
    }
    return null;
}
exports.getInviteInfoEmbed = getInviteInfoEmbed;
