"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDiscordPermissions = void 0;
const eris_1 = require("eris");
/**
 * @param resolvedPermissions A Permission object from e.g. GuildChannel#permissionsOf() or Member#permission
 * @param requiredPermissions Bitmask of required permissions
 */
function hasDiscordPermissions(resolvedPermissions, requiredPermissions) {
    const allowedPermissions = BigInt(resolvedPermissions.allow);
    const nRequiredPermissions = BigInt(requiredPermissions);
    if (Boolean(allowedPermissions & BigInt(eris_1.Constants.Permissions.administrator))) {
        return true;
    }
    return Boolean((allowedPermissions & nRequiredPermissions) === nRequiredPermissions);
}
exports.hasDiscordPermissions = hasDiscordPermissions;
