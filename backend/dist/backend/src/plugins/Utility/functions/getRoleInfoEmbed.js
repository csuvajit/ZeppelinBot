"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleInfoEmbed = void 0;
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const MENTION_ICON = "https://cdn.discordapp.com/attachments/705009450855039042/839284872152481792/mention.png";
async function getRoleInfoEmbed(pluginData, role, requestMemberId) {
    const embed = {
        fields: [],
    };
    embed.author = {
        name: `Role:  ${role.name}`,
        icon_url: MENTION_ICON,
    };
    embed.color = role.color;
    const createdAt = moment_timezone_1.default.utc(role.createdAt, "x");
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    const tzCreatedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
        : timeAndDate.inGuildTz(createdAt);
    const prettyCreatedAt = tzCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const roleAge = humanize_duration_1.default(Date.now() - role.createdAt, {
        largest: 2,
        round: true,
    });
    const rolePerms = Object.keys(role.permissions.json).map(p => p
        // Voice channel related permission names start with 'voice'
        .replace(/^voice/i, "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .replace(/(^\w{1})|(\s{1}\w{1})/g, l => l.toUpperCase()));
    // -1 because of the @everyone role
    const totalGuildRoles = pluginData.guild.roles.size - 1;
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Role information",
        value: utils_1.trimLines(`
      Name: **${role.name}**
      ID: \`${role.id}\`
      Created: **${roleAge} ago** (\`${prettyCreatedAt}\`)
      Position: **${role.position} / ${totalGuildRoles}**
      Color: **#${role.color
            .toString(16)
            .toUpperCase()
            .padStart(6, "0")}**
      Mentionable: **${role.mentionable ? "Yes" : "No"}**
      Hoisted: **${role.hoist ? "Yes" : "No"}**
      Permissions: \`${rolePerms.length ? rolePerms.join(", ") : "None"}\`
      Mention: <@&${role.id}> (\`<@&${role.id}>\`)
    `),
    });
    return embed;
}
exports.getRoleInfoEmbed = getRoleInfoEmbed;
