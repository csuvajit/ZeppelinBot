"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildPersistedData_1 = require("../../data/GuildPersistedData");
const GuildLogs_1 = require("../../data/GuildLogs");
const StoreDataEvt_1 = require("./events/StoreDataEvt");
const LoadDataEvt_1 = require("./events/LoadDataEvt");
const utils_1 = require("../../utils");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const defaultOptions = {
    config: {
        persisted_roles: [],
        persist_nicknames: false,
        persist_voice_mutes: false,
    },
};
exports.PersistPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "persist",
    showInDocs: true,
    info: {
        prettyName: "Persist",
        description: utils_1.trimPluginDescription(`
      Re-apply roles or nicknames for users when they rejoin the server.
      Mute roles are re-applied automatically, this plugin is not required for that.
    `),
    },
    dependencies: [LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    events: [
        StoreDataEvt_1.StoreDataEvt,
        LoadDataEvt_1.LoadDataEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.persistedData = GuildPersistedData_1.GuildPersistedData.getGuildInstance(guild.id);
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
    },
});
