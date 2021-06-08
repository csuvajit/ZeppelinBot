"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRolesPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildReactionRoles_1 = require("../../data/GuildReactionRoles");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const Queue_1 = require("../../Queue");
const autoRefreshLoop_1 = require("./util/autoRefreshLoop");
const InitReactionRolesCmd_1 = require("./commands/InitReactionRolesCmd");
const RefreshReactionRolesCmd_1 = require("./commands/RefreshReactionRolesCmd");
const ClearReactionRolesCmd_1 = require("./commands/ClearReactionRolesCmd");
const AddReactionRoleEvt_1 = require("./events/AddReactionRoleEvt");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const MIN_AUTO_REFRESH = 1000 * 60 * 15; // 15min minimum, let's not abuse the API
const defaultOptions = {
    config: {
        auto_refresh_interval: MIN_AUTO_REFRESH,
        remove_user_reactions: true,
        can_manage: false,
    },
    overrides: [
        {
            level: ">=100",
            config: {
                can_manage: true,
            },
        },
    ],
};
exports.ReactionRolesPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "reaction_roles",
    showInDocs: true,
    info: {
        prettyName: "Reaction roles",
    },
    dependencies: [LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        RefreshReactionRolesCmd_1.RefreshReactionRolesCmd,
        ClearReactionRolesCmd_1.ClearReactionRolesCmd,
        InitReactionRolesCmd_1.InitReactionRolesCmd,
    ],
    // prettier-ignore
    events: [
        AddReactionRoleEvt_1.AddReactionRoleEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.reactionRoles = GuildReactionRoles_1.GuildReactionRoles.getGuildInstance(guild.id);
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.reactionRemoveQueue = new Queue_1.Queue();
        state.roleChangeQueue = new Queue_1.Queue();
        state.pendingRoleChanges = new Map();
        state.pendingRefreshes = new Set();
    },
    afterLoad(pluginData) {
        let autoRefreshInterval = pluginData.config.get().auto_refresh_interval;
        if (autoRefreshInterval != null) {
            autoRefreshInterval = Math.max(MIN_AUTO_REFRESH, autoRefreshInterval);
            autoRefreshLoop_1.autoRefreshLoop(pluginData, autoRefreshInterval);
        }
    },
    beforeUnload(pluginData) {
        if (pluginData.state.autoRefreshTimeout) {
            clearTimeout(pluginData.state.autoRefreshTimeout);
        }
    },
});
