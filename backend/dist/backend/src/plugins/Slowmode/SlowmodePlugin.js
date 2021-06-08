"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowmodePlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildSlowmodes_1 = require("../../data/GuildSlowmodes");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildLogs_1 = require("../../data/GuildLogs");
const utils_1 = require("../../utils");
const onMessageCreate_1 = require("./util/onMessageCreate");
const clearExpiredSlowmodes_1 = require("./util/clearExpiredSlowmodes");
const SlowmodeDisableCmd_1 = require("./commands/SlowmodeDisableCmd");
const SlowmodeClearCmd_1 = require("./commands/SlowmodeClearCmd");
const SlowmodeListCmd_1 = require("./commands/SlowmodeListCmd");
const SlowmodeGetCmd_1 = require("./commands/SlowmodeGetCmd");
const SlowmodeSetCmd_1 = require("./commands/SlowmodeSetCmd");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const BOT_SLOWMODE_CLEAR_INTERVAL = 60 * utils_1.SECONDS;
const defaultOptions = {
    config: {
        use_native_slowmode: true,
        can_manage: false,
        is_affected: true,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_manage: true,
                is_affected: false,
            },
        },
    ],
};
exports.SlowmodePlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "slowmode",
    showInDocs: true,
    info: {
        prettyName: "Slowmode",
    },
    dependencies: [LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        SlowmodeDisableCmd_1.SlowmodeDisableCmd,
        SlowmodeClearCmd_1.SlowmodeClearCmd,
        SlowmodeListCmd_1.SlowmodeListCmd,
        SlowmodeGetCmd_1.SlowmodeGetCmd,
        SlowmodeSetCmd_1.SlowmodeSetCmd,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.slowmodes = GuildSlowmodes_1.GuildSlowmodes.getGuildInstance(guild.id);
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
    },
    afterLoad(pluginData) {
        const { state } = pluginData;
        state.clearInterval = setInterval(() => clearExpiredSlowmodes_1.clearExpiredSlowmodes(pluginData), BOT_SLOWMODE_CLEAR_INTERVAL);
        state.onMessageCreateFn = msg => onMessageCreate_1.onMessageCreate(pluginData, msg);
        state.savedMessages.events.on("create", state.onMessageCreateFn);
    },
    beforeUnload(pluginData) {
        pluginData.state.savedMessages.events.off("create", pluginData.state.onMessageCreateFn);
        clearInterval(pluginData.state.clearInterval);
    },
});
