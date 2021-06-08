"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMissingChannelPermissions = void 0;
const getMissingPermissions_1 = require("./getMissingPermissions");
/**
 * @param requiredPermissions Bitmask of required permissions
 * @return Bitmask of missing permissions
 */
function getMissingChannelPermissions(member, channel, requiredPermissions) {
    const memberChannelPermissions = channel.permissionsOf(member.id);
    return getMissingPermissions_1.getMissingPermissions(memberChannelPermissions, requiredPermissions);
}
exports.getMissingChannelPermissions = getMissingChannelPermissions;
