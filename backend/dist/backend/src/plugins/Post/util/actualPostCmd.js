"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualPostCmd = void 0;
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const LogType_1 = require("../../../data/LogType");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const pluginUtils_1 = require("../../../pluginUtils");
const parseScheduleTime_1 = require("./parseScheduleTime");
const postMessage_1 = require("./postMessage");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const MIN_REPEAT_TIME = 5 * utils_1.MINUTES;
const MAX_REPEAT_TIME = Math.pow(2, 32);
const MAX_REPEAT_UNTIL = moment_timezone_1.default.utc().add(100, "years");
async function actualPostCmd(pluginData, msg, targetChannel, content, opts = {}) {
    if (!(targetChannel instanceof eris_1.TextChannel)) {
        msg.channel.createMessage(utils_1.errorMessage("Channel is not a text channel"));
        return;
    }
    if (content == null && msg.attachments.length === 0) {
        msg.channel.createMessage(utils_1.errorMessage("Message content or attachment required"));
        return;
    }
    if (opts.repeat) {
        if (opts.repeat < MIN_REPEAT_TIME) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Minimum time for -repeat is ${humanize_duration_1.default(MIN_REPEAT_TIME)}`);
            return;
        }
        if (opts.repeat > MAX_REPEAT_TIME) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Max time for -repeat is ${humanize_duration_1.default(MAX_REPEAT_TIME)}`);
            return;
        }
    }
    // If this is a scheduled or repeated post, figure out the next post date
    let postAt;
    if (opts.schedule) {
        // Schedule the post to be posted later
        postAt = await parseScheduleTime_1.parseScheduleTime(pluginData, msg.author.id, opts.schedule);
        if (!postAt) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid schedule time");
            return;
        }
    }
    else if (opts.repeat) {
        postAt = moment_timezone_1.default.utc().add(opts.repeat, "ms");
    }
    // For repeated posts, make sure repeat-until or repeat-times is specified
    let repeatUntil = null;
    let repeatTimes = null;
    let repeatDetailsStr = null;
    if (opts["repeat-until"]) {
        repeatUntil = await parseScheduleTime_1.parseScheduleTime(pluginData, msg.author.id, opts["repeat-until"]);
        // Invalid time
        if (!repeatUntil) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid time specified for -repeat-until");
            return;
        }
        if (repeatUntil.isBefore(moment_timezone_1.default.utc())) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You can't set -repeat-until in the past");
            return;
        }
        if (repeatUntil.isAfter(MAX_REPEAT_UNTIL)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unfortunately, -repeat-until can only be at most 100 years into the future. Maybe 99 years would be enough?");
            return;
        }
    }
    else if (opts["repeat-times"]) {
        repeatTimes = opts["repeat-times"];
        if (repeatTimes <= 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "-repeat-times must be 1 or more");
            return;
        }
    }
    if (repeatUntil && repeatTimes) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You can only use one of -repeat-until or -repeat-times at once");
        return;
    }
    if (opts.repeat && !repeatUntil && !repeatTimes) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You must specify -repeat-until or -repeat-times for repeated messages");
        return;
    }
    if (opts.repeat) {
        repeatDetailsStr = repeatUntil
            ? `every ${humanize_duration_1.default(opts.repeat)} until ${repeatUntil.format(utils_1.DBDateFormat)}`
            : `every ${humanize_duration_1.default(opts.repeat)}, ${repeatTimes} times in total`;
    }
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    // Save schedule/repeat information in DB
    if (postAt) {
        if (postAt < moment_timezone_1.default.utc()) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Post can't be scheduled to be posted in the past");
            return;
        }
        await pluginData.state.scheduledPosts.create({
            author_id: msg.author.id,
            author_name: `${msg.author.username}#${msg.author.discriminator}`,
            channel_id: targetChannel.id,
            content,
            attachments: msg.attachments,
            post_at: postAt
                .clone()
                .tz("Etc/UTC")
                .format(utils_1.DBDateFormat),
            enable_mentions: opts["enable-mentions"],
            repeat_interval: opts.repeat,
            repeat_until: repeatUntil
                ? repeatUntil
                    .clone()
                    .tz("Etc/UTC")
                    .format(utils_1.DBDateFormat)
                : null,
            repeat_times: repeatTimes ?? null,
        });
        if (opts.repeat) {
            pluginData.state.logs.log(LogType_1.LogType.SCHEDULED_REPEATED_MESSAGE, {
                author: utils_1.stripObjectToScalars(msg.author),
                channel: utils_1.stripObjectToScalars(targetChannel),
                datetime: postAt.format(timeAndDate.getDateFormat("pretty_datetime")),
                date: postAt.format(timeAndDate.getDateFormat("date")),
                time: postAt.format(timeAndDate.getDateFormat("time")),
                repeatInterval: humanize_duration_1.default(opts.repeat),
                repeatDetails: repeatDetailsStr,
            });
        }
        else {
            pluginData.state.logs.log(LogType_1.LogType.SCHEDULED_MESSAGE, {
                author: utils_1.stripObjectToScalars(msg.author),
                channel: utils_1.stripObjectToScalars(targetChannel),
                datetime: postAt.format(timeAndDate.getDateFormat("pretty_datetime")),
                date: postAt.format(timeAndDate.getDateFormat("date")),
                time: postAt.format(timeAndDate.getDateFormat("time")),
            });
        }
    }
    // When the message isn't scheduled for later, post it immediately
    if (!opts.schedule) {
        await postMessage_1.postMessage(pluginData, targetChannel, content, msg.attachments, opts["enable-mentions"]);
    }
    if (opts.repeat) {
        pluginData.state.logs.log(LogType_1.LogType.REPEATED_MESSAGE, {
            author: utils_1.stripObjectToScalars(msg.author),
            channel: utils_1.stripObjectToScalars(targetChannel),
            datetime: postAt.format(timeAndDate.getDateFormat("pretty_datetime")),
            date: postAt.format(timeAndDate.getDateFormat("date")),
            time: postAt.format(timeAndDate.getDateFormat("time")),
            repeatInterval: humanize_duration_1.default(opts.repeat),
            repeatDetails: repeatDetailsStr,
        });
    }
    // Bot reply schenanigans
    let successMessage = opts.schedule
        ? `Message scheduled to be posted in <#${targetChannel.id}> on ${postAt.format(timeAndDate.getDateFormat("pretty_datetime"))}`
        : `Message posted in <#${targetChannel.id}>`;
    if (opts.repeat) {
        successMessage += `. Message will be automatically reposted every ${humanize_duration_1.default(opts.repeat)}`;
        if (repeatUntil) {
            successMessage += ` until ${repeatUntil.format(timeAndDate.getDateFormat("pretty_datetime"))}`;
        }
        else if (repeatTimes) {
            successMessage += `, ${repeatTimes} times in total`;
        }
        successMessage += ".";
    }
    if (targetChannel.id !== msg.channel.id || opts.schedule || opts.repeat) {
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, successMessage);
    }
}
exports.actualPostCmd = actualPostCmd;
