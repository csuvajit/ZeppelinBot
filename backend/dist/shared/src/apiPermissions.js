"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.permissionArrToSet = exports.permissionHierarchy = exports.permissionNames = exports.ApiPermissions = void 0;
var ApiPermissions;
(function (ApiPermissions) {
    ApiPermissions["Owner"] = "OWNER";
    ApiPermissions["ManageAccess"] = "MANAGE_ACCESS";
    ApiPermissions["EditConfig"] = "EDIT_CONFIG";
    ApiPermissions["ReadConfig"] = "READ_CONFIG";
    ApiPermissions["ViewGuild"] = "VIEW_GUILD";
})(ApiPermissions = exports.ApiPermissions || (exports.ApiPermissions = {}));
const reverseApiPermissions = Object.entries(ApiPermissions).reduce((map, [key, value]) => {
    map[value] = key;
    return map;
}, {});
exports.permissionNames = {
    [ApiPermissions.Owner]: "Server owner",
    [ApiPermissions.ManageAccess]: "Manage dashboard access",
    [ApiPermissions.EditConfig]: "Edit config",
    [ApiPermissions.ReadConfig]: "Read config",
    [ApiPermissions.ViewGuild]: "View server",
};
// prettier-ignore-start
exports.permissionHierarchy = [
    [
        ApiPermissions.Owner,
        [
            [
                ApiPermissions.ManageAccess,
                [[ApiPermissions.EditConfig, [[ApiPermissions.ReadConfig, [ApiPermissions.ViewGuild]]]]],
            ],
        ],
    ],
];
// prettier-ignore-end
function permissionArrToSet(permissions) {
    return new Set(permissions.filter(p => reverseApiPermissions[p]));
}
exports.permissionArrToSet = permissionArrToSet;
/**
 * Checks whether granted permissions include the specified permission, taking into account permission hierarchy i.e.
 * that in the case of nested permissions, having a top level permission implicitly grants you any permissions nested
 * under it as well
 */
function hasPermission(grantedPermissions, permissionToCheck) {
    // Directly granted
    if (grantedPermissions.has(permissionToCheck)) {
        return true;
    }
    // Check by hierarchy
    if (checkTreeForPermission(exports.permissionHierarchy, grantedPermissions, permissionToCheck)) {
        return true;
    }
    return false;
}
exports.hasPermission = hasPermission;
function checkTreeForPermission(tree, grantedPermissions, permission) {
    for (const item of tree) {
        const [perm, nested] = Array.isArray(item) ? item : [item];
        // Top-level permission granted, implicitly grant all nested permissions as well
        if (grantedPermissions.has(perm)) {
            // Permission we were looking for was found nested under this permission -> granted
            if (nested && treeIncludesPermission(nested, permission)) {
                return true;
            }
            // Permission we were looking for was not found nested under this permission
            // Since direct grants are not handled by this function, we can skip any further checks for this nested tree
            continue;
        }
        // Top-level permission not granted, check further nested permissions
        if (nested && checkTreeForPermission(nested, grantedPermissions, permission)) {
            return true;
        }
    }
    return false;
}
function treeIncludesPermission(tree, permission) {
    for (const item of tree) {
        const [perm, nested] = Array.isArray(item) ? item : [item];
        if (perm === permission) {
            return true;
        }
        const nestedResult = nested && treeIncludesPermission(nested, permission);
        if (nestedResult) {
            return true;
        }
    }
    return false;
}
