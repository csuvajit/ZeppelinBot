"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassRemoveRoleCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const logger_1 = require("../../../logger");
exports.MassRemoveRoleCmd = types_1.rolesCmd({
    trigger: "massremoverole",
    permission: "can_mass_assign",
    signature: {
        role: commandTypes_1.commandTypeHelpers.string(),
        members: commandTypes_1.commandTypeHelpers.string({ rest: true }),
    },
    async run({ message: msg, args, pluginData }) {
        msg.channel.createMessage(`Resolving members...`);
        const members = [];
        const unknownMembers = [];
        for (const memberId of args.members) {
            const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, memberId);
            if (member)
                members.push(member);
            else
                unknownMembers.push(memberId);
        }
        for (const member of members) {
            if (!pluginUtils_1.canActOn(pluginData, msg.member, member, true)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot add roles to 1 or more specified members: insufficient permissions");
                return;
            }
        }
        const roleId = await utils_1.resolveRoleId(pluginData.client, pluginData.guild.id, args.role);
        if (!roleId) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid role id");
            return;
        }
        const config = await pluginData.config.getForMessage(msg);
        if (!config.assignable_roles.includes(roleId)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You cannot remove that role");
            return;
        }
        const role = pluginData.guild.roles.get(roleId);
        if (!role) {
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Unknown role configured for 'roles' plugin: ${roleId}`,
            });
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You cannot remove that role");
            return;
        }
        const membersWithTheRole = members.filter(m => m.roles.includes(roleId));
        let assigned = 0;
        const failed = [];
        const didNotHaveRole = members.length - membersWithTheRole.length;
        msg.channel.createMessage(`Removing role **${role.name}** from ${membersWithTheRole.length} ${membersWithTheRole.length === 1 ? "member" : "members"}...`);
        for (const member of membersWithTheRole) {
            try {
                pluginData.state.logs.ignoreLog(LogType_1.LogType.MEMBER_ROLE_REMOVE, member.id);
                await member.removeRole(roleId);
                pluginData.state.logs.log(LogType_1.LogType.MEMBER_ROLE_REMOVE, {
                    member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
                    roles: role.name,
                    mod: utils_1.stripObjectToScalars(msg.author),
                });
                assigned++;
            }
            catch (e) {
                logger_1.logger.warn(`Error when removing role via !massremoverole: ${e.message}`);
                failed.push(member.id);
            }
        }
        let resultMessage = `Removed role **${role.name}** from  ${assigned} ${assigned === 1 ? "member" : "members"}!`;
        if (didNotHaveRole) {
            resultMessage += ` ${didNotHaveRole} ${didNotHaveRole === 1 ? "member" : "members"} didn't have the role.`;
        }
        if (failed.length) {
            resultMessage += `\nFailed to remove the role from the following members: ${failed.join(", ")}`;
        }
        if (unknownMembers.length) {
            resultMessage += `\nUnknown members: ${unknownMembers.join(", ")}`;
        }
        msg.channel.createMessage(utils_1.successMessage(resultMessage));
    },
});
