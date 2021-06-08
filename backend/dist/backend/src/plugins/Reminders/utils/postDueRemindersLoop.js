"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDueRemindersLoop = void 0;
const eris_1 = require("eris");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const helpers_1 = require("knub/dist/helpers");
const utils_1 = require("../../../utils");
const REMINDER_LOOP_TIME = 10 * utils_1.SECONDS;
const MAX_TRIES = 3;
async function postDueRemindersLoop(pluginData) {
    const pendingReminders = await pluginData.state.reminders.getDueReminders();
    for (const reminder of pendingReminders) {
        const channel = pluginData.guild.channels.get(reminder.channel_id);
        if (channel && channel instanceof eris_1.TextChannel) {
            try {
                // Only show created at date if one exists
                if (moment_timezone_1.default.utc(reminder.created_at).isValid()) {
                    const target = moment_timezone_1.default.utc();
                    const diff = target.diff(moment_timezone_1.default.utc(reminder.created_at, "YYYY-MM-DD HH:mm:ss"));
                    const result = humanize_duration_1.default(diff, { largest: 2, round: true });
                    await channel.createMessage({
                        content: helpers_1.disableLinkPreviews(`Reminder for <@!${reminder.user_id}>: ${reminder.body} \n\`Set at ${reminder.created_at} (${result} ago)\``),
                        allowedMentions: {
                            users: [reminder.user_id],
                        },
                    });
                }
                else {
                    await channel.createMessage({
                        content: helpers_1.disableLinkPreviews(`Reminder for <@!${reminder.user_id}>: ${reminder.body}`),
                        allowedMentions: {
                            users: [reminder.user_id],
                        },
                    });
                }
            }
            catch {
                // Probably random Discord internal server error or missing permissions or somesuch
                // Try again next round unless we've already tried to post this a bunch of times
                const tries = pluginData.state.tries.get(reminder.id) || 0;
                if (tries < MAX_TRIES) {
                    pluginData.state.tries.set(reminder.id, tries + 1);
                    continue;
                }
            }
        }
        await pluginData.state.reminders.delete(reminder.id);
    }
    if (!pluginData.state.unloaded) {
        pluginData.state.postRemindersTimeout = setTimeout(() => postDueRemindersLoop(pluginData), REMINDER_LOOP_TIME);
    }
}
exports.postDueRemindersLoop = postDueRemindersLoop;
