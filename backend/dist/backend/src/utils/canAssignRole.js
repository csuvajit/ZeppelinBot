"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAssignRole = void 0;
const eris_1 = require("eris");
const getMissingPermissions_1 = require("./getMissingPermissions");
const hasDiscordPermissions_1 = require("./hasDiscordPermissions");
function canAssignRole(guild, member, roleId) {
    if (getMissingPermissions_1.getMissingPermissions(member.permission, eris_1.Constants.Permissions.manageRoles)) {
        return false;
    }
    if (roleId === guild.id) {
        return false;
    }
    const targetRole = guild.roles.get(roleId);
    if (!targetRole) {
        return false;
    }
    const memberRoles = member.roles.map(_roleId => guild.roles.get(_roleId));
    const highestRoleWithManageRoles = memberRoles.reduce((highest, role) => {
        if (!hasDiscordPermissions_1.hasDiscordPermissions(role.permissions, eris_1.Constants.Permissions.manageRoles))
            return highest;
        if (highest == null)
            return role;
        if (role.position > highest.position)
            return role;
        return highest;
    }, null);
    return highestRoleWithManageRoles && highestRoleWithManageRoles.position > targetRole.position;
}
exports.canAssignRole = canAssignRole;
