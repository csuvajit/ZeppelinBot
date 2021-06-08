"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDashboardUsersCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
exports.ListDashboardUsersCmd = types_1.botControlCmd({
    trigger: ["list_dashboard_users"],
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    signature: {
        guildId: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ pluginData, message: msg, args }) {
        const guild = await pluginData.state.allowedGuilds.find(args.guildId);
        if (!guild) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Server is not using Zeppelin");
            return;
        }
        const dashboardUsers = await pluginData.state.apiPermissionAssignments.getByGuildId(guild.id);
        const users = await Promise.all(dashboardUsers.map(perm => utils_1.resolveUser(pluginData.client, perm.target_id)));
        const userNameList = users.map(user => `<@!${user.id}> (**${user.username}#${user.discriminator}**, \`${user.id}\`)`);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `The following users have dashboard access for **${guild.name}**:\n\n${userNameList}`, {});
    },
});
