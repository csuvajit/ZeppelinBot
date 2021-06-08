"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDeletePlugin = void 0;
const types_1 = require("./types");
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildLogs_1 = require("../../data/GuildLogs");
const onMessageCreate_1 = require("./util/onMessageCreate");
const onMessageDelete_1 = require("./util/onMessageDelete");
const onMessageDeleteBulk_1 = require("./util/onMessageDeleteBulk");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const defaultOptions = {
    config: {
        enabled: false,
        delay: "5s",
    },
};
exports.AutoDeletePlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "auto_delete",
    showInDocs: true,
    info: {
        prettyName: "Auto-delete",
        description: "Allows Zeppelin to auto-delete messages from a channel after a delay",
        configurationGuide: "Maximum deletion delay is currently 5 minutes",
    },
    dependencies: [TimeAndDatePlugin_1.TimeAndDatePlugin, LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.guildSavedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.guildLogs = new GuildLogs_1.GuildLogs(guild.id);
        state.deletionQueue = [];
        state.nextDeletion = null;
        state.nextDeletionTimeout = null;
        state.maxDelayWarningSent = false;
    },
    afterLoad(pluginData) {
        const { state, guild } = pluginData;
        state.onMessageCreateFn = msg => onMessageCreate_1.onMessageCreate(pluginData, msg);
        state.guildSavedMessages.events.on("create", state.onMessageCreateFn);
        state.onMessageDeleteFn = msg => onMessageDelete_1.onMessageDelete(pluginData, msg);
        state.guildSavedMessages.events.on("delete", state.onMessageDeleteFn);
        state.onMessageDeleteBulkFn = msgs => onMessageDeleteBulk_1.onMessageDeleteBulk(pluginData, msgs);
        state.guildSavedMessages.events.on("deleteBulk", state.onMessageDeleteBulkFn);
    },
    beforeUnload(pluginData) {
        pluginData.state.guildSavedMessages.events.off("create", pluginData.state.onMessageCreateFn);
        pluginData.state.guildSavedMessages.events.off("delete", pluginData.state.onMessageDeleteFn);
        pluginData.state.guildSavedMessages.events.off("deleteBulk", pluginData.state.onMessageDeleteBulkFn);
    },
});
