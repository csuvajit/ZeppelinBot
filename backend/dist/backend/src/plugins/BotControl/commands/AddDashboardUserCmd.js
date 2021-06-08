"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDashboardUserCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const apiPermissions_1 = require("@shared/apiPermissions");
exports.AddDashboardUserCmd = types_1.botControlCmd({
    trigger: ["add_dashboard_user"],
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    signature: {
        guildId: commandTypes_1.commandTypeHelpers.string(),
        users: commandTypes_1.commandTypeHelpers.resolvedUser({ rest: true }),
    },
    async run({ pluginData, message: msg, args }) {
        const guild = await pluginData.state.allowedGuilds.find(args.guildId);
        if (!guild) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Server is not using Zeppelin");
            return;
        }
        for (const user of args.users) {
            const existingAssignment = await pluginData.state.apiPermissionAssignments.getByGuildAndUserId(args.guildId, user.id);
            if (existingAssignment) {
                continue;
            }
            await pluginData.state.apiPermissionAssignments.addUser(args.guildId, user.id, [apiPermissions_1.ApiPermissions.EditConfig]);
        }
        const userNameList = args.users.map(user => `<@!${user.id}> (**${user.username}#${user.discriminator}**, \`${user.id}\`)`);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `The following users were given dashboard access for **${guild.name}**:\n\n${userNameList}`);
    },
});
