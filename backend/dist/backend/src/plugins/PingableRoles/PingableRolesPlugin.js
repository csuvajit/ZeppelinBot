"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingableRolesPlugin = void 0;
const types_1 = require("./types");
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const GuildPingableRoles_1 = require("../../data/GuildPingableRoles");
const PingableRoleEnableCmd_1 = require("./commands/PingableRoleEnableCmd");
const PingableRoleDisableCmd_1 = require("./commands/PingableRoleDisableCmd");
const ChangePingableEvts_1 = require("./events/ChangePingableEvts");
const defaultOptions = {
    config: {
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
exports.PingableRolesPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "pingable_roles",
    showInDocs: true,
    info: {
        prettyName: "Pingable roles",
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        PingableRoleEnableCmd_1.PingableRoleEnableCmd,
        PingableRoleDisableCmd_1.PingableRoleDisableCmd,
    ],
    // prettier-ignore
    events: [
        ChangePingableEvts_1.TypingEnablePingableEvt,
        ChangePingableEvts_1.MessageCreateDisablePingableEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.pingableRoles = GuildPingableRoles_1.GuildPingableRoles.getGuildInstance(guild.id);
        state.cache = new Map();
        state.timeouts = new Map();
    },
});
