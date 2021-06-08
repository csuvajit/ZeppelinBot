"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassAddRoleCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const logger_1 = require("../../../logger");
exports.MassAddRoleCmd = types_1.rolesCmd({
    trigger: "massaddrole",
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
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You cannot assign that role");
            return;
        }
        const role = pluginData.guild.roles.get(roleId);
        if (!role) {
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Unknown role configured for 'roles' plugin: ${roleId}`,
            });
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You cannot assign that role");
            return;
        }
        const membersWithoutTheRole = members.filter(m => !m.roles.includes(roleId));
        let assigned = 0;
        const failed = [];
        const alreadyHadRole = members.length - membersWithoutTheRole.length;
        msg.channel.createMessage(`Adding role **${role.name}** to ${membersWithoutTheRole.length} ${membersWithoutTheRole.length === 1 ? "member" : "members"}...`);
        for (const member of membersWithoutTheRole) {
            try {
                pluginData.state.logs.ignoreLog(LogType_1.LogType.MEMBER_ROLE_ADD, member.id);
                await member.addRole(roleId);
                pluginData.state.logs.log(LogType_1.LogType.MEMBER_ROLE_ADD, {
                    member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
                    roles: role.name,
                    mod: utils_1.stripObjectToScalars(msg.author),
                });
                assigned++;
            }
            catch (e) {
                logger_1.logger.warn(`Error when adding role via !massaddrole: ${e.message}`);
                failed.push(member.id);
            }
        }
        let resultMessage = `Added role **${role.name}** to ${assigned} ${assigned === 1 ? "member" : "members"}!`;
        if (alreadyHadRole) {
            resultMessage += ` ${alreadyHadRole} ${alreadyHadRole === 1 ? "member" : "members"} already had the role.`;
        }
        if (failed.length) {
            resultMessage += `\nFailed to add the role to the following members: ${failed.join(", ")}`;
        }
        if (unknownMembers.length) {
            resultMessage += `\nUnknown members: ${unknownMembers.join(", ")}`;
        }
        msg.channel.createMessage(utils_1.successMessage(resultMessage));
    },
});
