"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionNames = void 0;
const eris_1 = require("eris");
const camelCaseToTitleCase = str => str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
const permissionNumberToName = new Map();
const ignoredPermissionConstants = ["all", "allGuild", "allText", "allVoice"];
for (const key in eris_1.Constants.Permissions) {
    if (ignoredPermissionConstants.includes(key))
        continue;
    permissionNumberToName.set(BigInt(eris_1.Constants.Permissions[key]), camelCaseToTitleCase(key));
}
/**
 * @param permissions Bitmask of permissions to get the names for
 */
function getPermissionNames(permissions) {
    const permissionNames = [];
    for (const [permissionNumber, permissionName] of permissionNumberToName.entries()) {
        if (BigInt(permissions) & permissionNumber) {
            permissionNames.push(permissionName);
        }
    }
    return permissionNames;
}
exports.getPermissionNames = getPermissionNames;
