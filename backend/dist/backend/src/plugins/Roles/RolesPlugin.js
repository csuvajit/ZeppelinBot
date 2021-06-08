"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildLogs_1 = require("../../data/GuildLogs");
const AddRoleCmd_1 = require("./commands/AddRoleCmd");
const RemoveRoleCmd_1 = require("./commands/RemoveRoleCmd");
const MassAddRoleCmd_1 = require("./commands/MassAddRoleCmd");
const MassRemoveRoleCmd_1 = require("./commands/MassRemoveRoleCmd");
const utils_1 = require("../../utils");
const defaultOptions = {
    config: {
        can_assign: false,
        can_mass_assign: false,
        assignable_roles: ["558037973581430785"],
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_assign: true,
            },
        },
        {
            level: ">=100",
            config: {
                can_mass_assign: true,
            },
        },
    ],
};
exports.RolesPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "roles",
    showInDocs: true,
    info: {
        prettyName: "Roles",
        description: utils_1.trimPluginDescription(`
      Enables authorised users to add and remove whitelisted roles with a command.
    `),
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        AddRoleCmd_1.AddRoleCmd,
        RemoveRoleCmd_1.RemoveRoleCmd,
        MassAddRoleCmd_1.MassAddRoleCmd,
        MassRemoveRoleCmd_1.MassRemoveRoleCmd,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
    },
});
