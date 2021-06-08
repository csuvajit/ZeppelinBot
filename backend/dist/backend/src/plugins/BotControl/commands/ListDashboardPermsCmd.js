"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDashboardPermsCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
exports.ListDashboardPermsCmd = types_1.botControlCmd({
    trigger: ["list_dashboard_permissions", "list_dashboard_perms", "list_dash_permissionss", "list_dash_perms"],
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    signature: {
        guildId: commandTypes_1.commandTypeHelpers.string({ option: true, shortcut: "g" }),
        user: commandTypes_1.commandTypeHelpers.resolvedUser({ option: true, shortcut: "u" }),
    },
    async run({ pluginData, message: msg, args }) {
        if (!args.user && !args.guildId) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Must specify at least guildId, user, or both.");
            return;
        }
        let guild;
        if (args.guildId) {
            guild = await pluginData.state.allowedGuilds.find(args.guildId);
            if (!guild) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Server is not using Zeppelin");
                return;
            }
        }
        let existingUserAssignment;
        if (args.user) {
            existingUserAssignment = await pluginData.state.apiPermissionAssignments.getByUserId(args.user.id);
            if (existingUserAssignment.length === 0) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "The user has no assigned permissions.");
                return;
            }
        }
        let finalMessage = "";
        // If we have user, always display which guilds they have permissions in (or only specified guild permissions)
        if (args.user) {
            const userInfo = `**${args.user.username}#${args.user.discriminator}** (\`${args.user.id}\`)`;
            for (const assignment of existingUserAssignment) {
                if (guild != null && assignment.guild_id !== args.guildId)
                    continue;
                const assignmentGuild = await pluginData.state.allowedGuilds.find(assignment.guild_id);
                const guildName = assignmentGuild?.name ?? "Unknown";
                const guildInfo = `**${guildName}** (\`${assignment.guild_id}\`)`;
                finalMessage += `The user ${userInfo} has the following permissions on server ${guildInfo}:`;
                finalMessage += `\n${assignment.permissions.join("\n")}\n\n`;
            }
            if (finalMessage === "") {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `The user ${userInfo} has no assigned permissions on the specified server.`);
                return;
            }
            // Else display all users that have permissions on the specified guild
        }
        else if (guild) {
            const guildInfo = `**${guild.name}** (\`${guild.id}\`)`;
            const existingGuildAssignment = await pluginData.state.apiPermissionAssignments.getByGuildId(guild.id);
            if (existingGuildAssignment.length === 0) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `The server ${guildInfo} has no assigned permissions.`);
                return;
            }
            finalMessage += `The server ${guildInfo} has the following assigned permissions:\n`; // Double \n for consistency with AddDashboardUserCmd
            for (const assignment of existingGuildAssignment) {
                const user = await utils_1.resolveUser(pluginData.client, assignment.target_id);
                finalMessage += `\n**${user.username}#${user.discriminator}**, \`${assignment.target_id}\`: ${assignment.permissions.join(", ")}`;
            }
        }
        await pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, finalMessage.trim(), {});
    },
});
