"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnowflakeInfoEmbed = void 0;
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const snowflakeToTimestamp_1 = require("../../../utils/snowflakeToTimestamp");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const SNOWFLAKE_ICON = "https://cdn.discordapp.com/attachments/740650744830623756/742020790471491668/snowflake.png";
async function getSnowflakeInfoEmbed(pluginData, snowflake, showUnknownWarning = false, requestMemberId) {
    const embed = {
        fields: [],
    };
    embed.author = {
        name: `Snowflake:  ${snowflake}`,
        icon_url: SNOWFLAKE_ICON,
    };
    if (showUnknownWarning) {
        embed.description =
            "This is a valid [snowflake ID](https://discord.com/developers/docs/reference#snowflakes), but I don't know what it's for.";
    }
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    const createdAtMS = snowflakeToTimestamp_1.snowflakeToTimestamp(snowflake);
    const createdAt = moment_timezone_1.default.utc(createdAtMS, "x");
    const tzCreatedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
        : timeAndDate.inGuildTz(createdAt);
    const prettyCreatedAt = tzCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const snowflakeAge = humanize_duration_1.default(Date.now() - createdAtMS, {
        largest: 2,
        round: true,
    });
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Basic information",
        value: `Created: **${snowflakeAge} ago** (\`${prettyCreatedAt}\`)`,
    });
    return embed;
}
exports.getSnowflakeInfoEmbed = getSnowflakeInfoEmbed;
