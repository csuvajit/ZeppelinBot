"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersDeleteCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const commandTypes_1 = require("../../../commandTypes");
exports.RemindersDeleteCmd = types_1.remindersCmd({
    trigger: ["reminders delete", "reminders d"],
    permission: "can_use",
    signature: {
        num: commandTypes_1.commandTypeHelpers.number(),
    },
    async run({ message: msg, args, pluginData }) {
        const reminders = await pluginData.state.reminders.getRemindersByUserId(msg.author.id);
        reminders.sort(utils_1.sorter("remind_at"));
        if (args.num > reminders.length || args.num <= 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown reminder");
            return;
        }
        const toDelete = reminders[args.num - 1];
        await pluginData.state.reminders.delete(toDelete.id);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Reminder deleted");
    },
});
