"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMissingPermissions = void 0;
const eris_1 = require("eris");
/**
 * @param resolvedPermissions A Permission object from e.g. GuildChannel#permissionsOf() or Member#permission
 * @param requiredPermissions Bitmask of required permissions
 * @return Bitmask of missing permissions
 */
function getMissingPermissions(resolvedPermissions, requiredPermissions) {
    const allowedPermissions = BigInt(resolvedPermissions.allow);
    const nRequiredPermissions = BigInt(requiredPermissions);
    if (Boolean(allowedPermissions & BigInt(eris_1.Constants.Permissions.administrator))) {
        return BigInt(0);
    }
    return nRequiredPermissions & ~allowedPermissions;
}
exports.getMissingPermissions = getMissingPermissions;
