"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingRoles = void 0;
function findMatchingRoles(roleNames, entries) {
    const aliasToRoleId = entries.reduce((map, entry) => {
        for (const [roleId, aliases] of Object.entries(entry.roles)) {
            for (const alias of aliases) {
                map.set(alias, roleId);
            }
        }
        return map;
    }, new Map());
    return roleNames.map(roleName => aliasToRoleId.get(roleName)).filter(Boolean);
}
exports.findMatchingRoles = findMatchingRoles;
