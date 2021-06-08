"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocateUserPlugin = void 0;
const types_1 = require("./types");
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const GuildVCAlerts_1 = require("../../data/GuildVCAlerts");
const outdatedLoop_1 = require("./utils/outdatedLoop");
const fillAlertsList_1 = require("./utils/fillAlertsList");
const WhereCmd_1 = require("./commands/WhereCmd");
const FollowCmd_1 = require("./commands/FollowCmd");
const ListFollowCmd_1 = require("./commands/ListFollowCmd");
const SendAlertsEvts_1 = require("./events/SendAlertsEvts");
const BanRemoveAlertsEvt_1 = require("./events/BanRemoveAlertsEvt");
const utils_1 = require("../../utils");
const defaultOptions = {
    config: {
        can_where: false,
        can_alert: false,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_where: true,
                can_alert: true,
            },
        },
    ],
};
exports.LocateUserPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "locate_user",
    showInDocs: true,
    info: {
        prettyName: "Locate user",
        description: utils_1.trimPluginDescription(`
      This plugin allows users with access to the commands the following:
      * Instantly receive an invite to the voice channel of a user
      * Be notified as soon as a user switches or joins a voice channel
    `),
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        WhereCmd_1.WhereCmd,
        FollowCmd_1.FollowCmd,
        ListFollowCmd_1.ListFollowCmd,
        ListFollowCmd_1.DeleteFollowCmd,
    ],
    // prettier-ignore
    events: [
        SendAlertsEvts_1.ChannelJoinAlertsEvt,
        SendAlertsEvts_1.ChannelSwitchAlertsEvt,
        SendAlertsEvts_1.ChannelLeaveAlertsEvt,
        BanRemoveAlertsEvt_1.GuildBanRemoveAlertsEvt
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.alerts = GuildVCAlerts_1.GuildVCAlerts.getGuildInstance(guild.id);
        state.outdatedAlertsTimeout = null;
        state.usersWithAlerts = [];
        state.unloaded = false;
    },
    afterLoad(pluginData) {
        outdatedLoop_1.outdatedAlertsLoop(pluginData);
        fillAlertsList_1.fillActiveAlertsList(pluginData);
    },
    beforeUnload(pluginData) {
        clearTimeout(pluginData.state.outdatedAlertsTimeout);
        pluginData.state.unloaded = true;
    },
});
