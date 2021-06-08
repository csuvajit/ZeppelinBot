"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotControlPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildArchives_1 = require("../../data/GuildArchives");
const eris_1 = require("eris");
const pluginUtils_1 = require("../../pluginUtils");
const activeReload_1 = require("./activeReload");
const ReloadGlobalPluginsCmd_1 = require("./commands/ReloadGlobalPluginsCmd");
const ServersCmd_1 = require("./commands/ServersCmd");
const LeaveServerCmd_1 = require("./commands/LeaveServerCmd");
const ReloadServerCmd_1 = require("./commands/ReloadServerCmd");
const AllowedGuilds_1 = require("../../data/AllowedGuilds");
const AllowServerCmd_1 = require("./commands/AllowServerCmd");
const DisallowServerCmd_1 = require("./commands/DisallowServerCmd");
const AddDashboardUserCmd_1 = require("./commands/AddDashboardUserCmd");
const RemoveDashboardUserCmd_1 = require("./commands/RemoveDashboardUserCmd");
const Configs_1 = require("../../data/Configs");
const ApiPermissionAssignments_1 = require("../../data/ApiPermissionAssignments");
const ListDashboardUsersCmd_1 = require("./commands/ListDashboardUsersCmd");
const ListDashboardPermsCmd_1 = require("./commands/ListDashboardPermsCmd");
const EligibleCmd_1 = require("./commands/EligibleCmd");
const defaultOptions = {
    config: {
        can_use: false,
        can_eligible: false,
        update_cmd: null,
    },
};
exports.BotControlPlugin = ZeppelinPluginBlueprint_1.zeppelinGlobalPlugin()({
    name: "bot_control",
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        ReloadGlobalPluginsCmd_1.ReloadGlobalPluginsCmd,
        ServersCmd_1.ServersCmd,
        LeaveServerCmd_1.LeaveServerCmd,
        ReloadServerCmd_1.ReloadServerCmd,
        AllowServerCmd_1.AllowServerCmd,
        DisallowServerCmd_1.DisallowServerCmd,
        AddDashboardUserCmd_1.AddDashboardUserCmd,
        RemoveDashboardUserCmd_1.RemoveDashboardUserCmd,
        ListDashboardUsersCmd_1.ListDashboardUsersCmd,
        ListDashboardPermsCmd_1.ListDashboardPermsCmd,
        EligibleCmd_1.EligibleCmd,
    ],
    afterLoad(pluginData) {
        pluginData.state.archives = new GuildArchives_1.GuildArchives(0);
        pluginData.state.allowedGuilds = new AllowedGuilds_1.AllowedGuilds();
        pluginData.state.configs = new Configs_1.Configs();
        pluginData.state.apiPermissionAssignments = new ApiPermissionAssignments_1.ApiPermissionAssignments();
        const activeReload = activeReload_1.getActiveReload();
        if (activeReload) {
            const [guildId, channelId] = activeReload;
            activeReload_1.resetActiveReload();
            const guild = pluginData.client.guilds.get(guildId);
            if (guild) {
                const channel = guild.channels.get(channelId);
                if (channel instanceof eris_1.TextChannel) {
                    pluginUtils_1.sendSuccessMessage(pluginData, channel, "Global plugins reloaded!");
                }
            }
        }
    },
});
