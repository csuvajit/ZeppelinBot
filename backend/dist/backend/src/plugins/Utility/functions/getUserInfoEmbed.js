"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfoEmbed = void 0;
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const CaseTypes_1 = require("../../../data/CaseTypes");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
async function getUserInfoEmbed(pluginData, userId, compact = false, requestMemberId) {
    const user = await utils_1.resolveUser(pluginData.client, userId);
    if (!user || user instanceof utils_1.UnknownUser) {
        return null;
    }
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
    const embed = {
        fields: [],
    };
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    embed.author = {
        name: `User:  ${user.username}#${user.discriminator}`,
    };
    const avatarURL = user.avatarURL || user.defaultAvatarURL;
    embed.author.icon_url = avatarURL;
    const createdAt = moment_timezone_1.default.utc(user.createdAt, "x");
    const tzCreatedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
        : timeAndDate.inGuildTz(createdAt);
    const prettyCreatedAt = tzCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const accountAge = humanize_duration_1.default(moment_timezone_1.default.utc().valueOf() - user.createdAt, {
        largest: 2,
        round: true,
    });
    if (compact) {
        embed.fields.push({
            name: utils_1.preEmbedPadding + "User information",
            value: utils_1.trimLines(`
          Profile: <@!${user.id}>
          Created: **${accountAge} ago** (\`${prettyCreatedAt}\`)
          `),
        });
        if (member) {
            const joinedAt = moment_timezone_1.default.utc(member.joinedAt, "x");
            const tzJoinedAt = requestMemberId
                ? await timeAndDate.inMemberTz(requestMemberId, joinedAt)
                : timeAndDate.inGuildTz(joinedAt);
            const prettyJoinedAt = tzJoinedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
            const joinAge = humanize_duration_1.default(moment_timezone_1.default.utc().valueOf() - member.joinedAt, {
                largest: 2,
                round: true,
            });
            embed.fields[0].value += `\nJoined: **${joinAge} ago** (\`${prettyJoinedAt}\`)`;
        }
        else {
            embed.fields.push({
                name: utils_1.preEmbedPadding + "!! NOTE !!",
                value: "User is not on the server",
            });
        }
        return embed;
    }
    embed.fields.push({
        name: utils_1.preEmbedPadding + "User information",
        value: utils_1.trimLines(`
        Name: **${user.username}#${user.discriminator}**
        ID: \`${user.id}\`
        Created: **${accountAge} ago** (\`${prettyCreatedAt}\`)
        Mention: <@!${user.id}>
        `),
    });
    if (member) {
        const joinedAt = moment_timezone_1.default.utc(member.joinedAt, "x");
        const tzJoinedAt = requestMemberId
            ? await timeAndDate.inMemberTz(requestMemberId, joinedAt)
            : timeAndDate.inGuildTz(joinedAt);
        const prettyJoinedAt = tzJoinedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
        const joinAge = humanize_duration_1.default(moment_timezone_1.default.utc().valueOf() - member.joinedAt, {
            largest: 2,
            round: true,
        });
        const roles = member.roles.map(id => pluginData.guild.roles.get(id)).filter(r => r != null);
        roles.sort(utils_1.sorter("position", "DESC"));
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Member information",
            value: utils_1.trimLines(`
          Joined: **${joinAge} ago** (\`${prettyJoinedAt}\`)
          ${roles.length > 0 ? "Roles: " + roles.map(r => `<@&${r.id}>`).join(", ") : ""}
        `),
        });
        const voiceChannel = member.voiceState.channelID
            ? pluginData.guild.channels.get(member.voiceState.channelID)
            : null;
        if (voiceChannel || member.voiceState.mute || member.voiceState.deaf) {
            embed.fields.push({
                name: utils_1.preEmbedPadding + "Voice information",
                value: utils_1.trimLines(`
          ${voiceChannel ? `Current voice channel: **${voiceChannel ? voiceChannel.name : "None"}**` : ""}
          ${member.voiceState.mute ? "Server voice muted: **Yes**" : ""}
          ${member.voiceState.deaf ? "Server voice deafened: **Yes**" : ""}
        `),
            });
        }
    }
    else {
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Member information",
            value: "⚠ User is not on the server",
        });
    }
    const cases = (await pluginData.state.cases.getByUserId(user.id)).filter(c => !c.is_hidden);
    if (cases.length > 0) {
        cases.sort((a, b) => {
            return a.created_at < b.created_at ? 1 : -1;
        });
        const caseSummary = cases.slice(0, 3).map(c => {
            const summaryText = `${CaseTypes_1.CaseTypes[c.type]} (#${c.case_number})`;
            if (c.log_message_id) {
                const [channelId, messageId] = c.log_message_id.split("-");
                return `[${summaryText}](${utils_1.messageLink(pluginData.guild.id, channelId, messageId)})`;
            }
            return summaryText;
        });
        const summaryLabel = cases.length > 3 ? "Last 3 cases" : "Summary";
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Cases",
            value: utils_1.trimLines(`
          Total cases: **${cases.length}**
          ${summaryLabel}: ${caseSummary.join(", ")}
        `),
        });
    }
    return embed;
}
exports.getUserInfoEmbed = getUserInfoEmbed;
