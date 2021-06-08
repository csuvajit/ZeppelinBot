"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireGuildPermission = exports.hasGuildPermission = void 0;
const apiPermissions_1 = require("@shared/apiPermissions");
const staff_1 = require("../staff");
const ApiPermissionAssignments_1 = require("../data/ApiPermissionAssignments");
const responses_1 = require("./responses");
const apiPermissionAssignments = new ApiPermissionAssignments_1.ApiPermissionAssignments();
const hasGuildPermission = async (userId, guildId, permission) => {
    if (staff_1.isStaff(userId)) {
        return true;
    }
    const permAssignment = await apiPermissionAssignments.getByGuildAndUserId(guildId, userId);
    if (!permAssignment) {
        return false;
    }
    return apiPermissions_1.hasPermission(apiPermissions_1.permissionArrToSet(permAssignment.permissions), permission);
};
exports.hasGuildPermission = hasGuildPermission;
/**
 * Requires `guildId` in req.params
 */
function requireGuildPermission(permission) {
    return async (req, res, next) => {
        if (!(await exports.hasGuildPermission(req.user.userId, req.params.guildId, permission))) {
            return responses_1.unauthorized(res);
        }
        next();
    };
}
exports.requireGuildPermission = requireGuildPermission;
