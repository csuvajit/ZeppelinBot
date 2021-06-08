"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersPlugin = void 0;
const types_1 = require("./types");
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const GuildReminders_1 = require("../../data/GuildReminders");
const postDueRemindersLoop_1 = require("./utils/postDueRemindersLoop");
const RemindCmd_1 = require("./commands/RemindCmd");
const RemindersCmd_1 = require("./commands/RemindersCmd");
const RemindersDeleteCmd_1 = require("./commands/RemindersDeleteCmd");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const defaultOptions = {
    config: {
        can_use: false,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_use: true,
            },
        },
    ],
};
exports.RemindersPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "reminders",
    showInDocs: true,
    info: {
        prettyName: "Reminders",
    },
    dependencies: [TimeAndDatePlugin_1.TimeAndDatePlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        RemindCmd_1.RemindCmd,
        RemindersCmd_1.RemindersCmd,
        RemindersDeleteCmd_1.RemindersDeleteCmd,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.reminders = GuildReminders_1.GuildReminders.getGuildInstance(guild.id);
        state.tries = new Map();
        state.unloaded = false;
        state.postRemindersTimeout = null;
    },
    afterLoad(pluginData) {
        postDueRemindersLoop_1.postDueRemindersLoop(pluginData);
    },
    beforeUnload(pluginData) {
        clearTimeout(pluginData.state.postRemindersTimeout);
        pluginData.state.unloaded = true;
    },
});
