"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
exports.RemindersCmd = types_1.remindersCmd({
    trigger: "reminders",
    permission: "can_use",
    async run({ message: msg, args, pluginData }) {
        const reminders = await pluginData.state.reminders.getRemindersByUserId(msg.author.id);
        if (reminders.length === 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No reminders");
            return;
        }
        const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
        reminders.sort(utils_1.sorter("remind_at"));
        const longestNum = (reminders.length + 1).toString().length;
        const lines = Array.from(reminders.entries()).map(([i, reminder]) => {
            const num = i + 1;
            const paddedNum = num.toString().padStart(longestNum, " ");
            const target = moment_timezone_1.default.utc(reminder.remind_at, "YYYY-MM-DD HH:mm:ss");
            const diff = target.diff(moment_timezone_1.default.utc());
            const result = humanize_duration_1.default(diff, { largest: 2, round: true });
            const prettyRemindAt = timeAndDate
                .inGuildTz(moment_timezone_1.default.utc(reminder.remind_at, utils_1.DBDateFormat))
                .format(timeAndDate.getDateFormat("pretty_datetime"));
            return `\`${paddedNum}.\` \`${prettyRemindAt} (${result})\` ${reminder.body}`;
        });
        utils_1.createChunkedMessage(msg.channel, lines.join("\n"));
    },
});
