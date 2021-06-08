"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const utils_1 = require("../../../utils");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const pluginUtils_1 = require("../../../pluginUtils");
const types_1 = require("../types");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
exports.RemindCmd = types_1.remindersCmd({
    trigger: ["remind", "remindme", "reminder"],
    usage: "!remind 3h Remind me of this in 3 hours please",
    permission: "can_use",
    signature: {
        time: commandTypes_1.commandTypeHelpers.string(),
        reminder: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
        const now = moment_timezone_1.default.utc();
        const tz = await timeAndDate.getMemberTz(msg.author.id);
        let reminderTime;
        if (args.time.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
            // Date in YYYY-MM-DD format, remind at current time on that date
            reminderTime = moment_timezone_1.default.tz(args.time, "YYYY-M-D", tz).set({
                hour: now.hour(),
                minute: now.minute(),
                second: now.second(),
            });
        }
        else if (args.time.match(/^\d{4}-\d{1,2}-\d{1,2}T\d{2}:\d{2}$/)) {
            // Date and time in YYYY-MM-DD[T]HH:mm format
            reminderTime = moment_timezone_1.default.tz(args.time, "YYYY-M-D[T]HH:mm", tz).second(0);
        }
        else {
            // "Delay string" i.e. e.g. "2h30m"
            const ms = utils_1.convertDelayStringToMS(args.time);
            if (ms === null) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid reminder time");
                return;
            }
            reminderTime = moment_timezone_1.default.utc().add(ms, "millisecond");
        }
        if (!reminderTime.isValid() || reminderTime.isBefore(now)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid reminder time");
            return;
        }
        const reminderBody = args.reminder || utils_1.messageLink(pluginData.guild.id, msg.channel.id, msg.id);
        await pluginData.state.reminders.add(msg.author.id, msg.channel.id, reminderTime
            .clone()
            .tz("Etc/UTC")
            .format("YYYY-MM-DD HH:mm:ss"), reminderBody, moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"));
        const msUntilReminder = reminderTime.diff(now);
        const timeUntilReminder = humanize_duration_1.default(msUntilReminder, { largest: 2, round: true });
        const prettyReminderTime = (await timeAndDate.inMemberTz(msg.author.id, reminderTime)).format(pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin).getDateFormat("pretty_datetime"));
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `I will remind you in **${timeUntilReminder}** at **${prettyReminderTime}**`);
    },
});
