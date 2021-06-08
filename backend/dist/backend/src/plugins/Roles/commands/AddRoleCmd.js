"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRoleCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
exports.AddRoleCmd = types_1.rolesCmd({
    trigger: "addrole",
    permission: "can_assign",
    description: "Add a role to the specified member",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember(),
        role: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        if (!pluginUtils_1.canActOn(pluginData, msg.member, args.member, true)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot add roles to this user: insufficient permissions");
            return;
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
        // Sanity check: make sure the role is configured properly
        const role = msg.channel.guild.roles.get(roleId);
        if (!role) {
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Unknown role configured for 'roles' plugin: ${roleId}`,
            });
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You cannot assign that role");
            return;
        }
        if (args.member.roles.includes(roleId)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Member already has that role");
            return;
        }
        pluginData.state.logs.ignoreLog(LogType_1.LogType.MEMBER_ROLE_ADD, args.member.id);
        await args.member.addRole(roleId);
        pluginData.state.logs.log(LogType_1.LogType.MEMBER_ROLE_ADD, {
            member: utils_1.stripObjectToScalars(args.member, ["user", "roles"]),
            roles: role.name,
            mod: utils_1.stripObjectToScalars(msg.author),
        });
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Added role **${role.name}** to ${utils_1.verboseUserMention(args.member.user)}!`);
    },
});
