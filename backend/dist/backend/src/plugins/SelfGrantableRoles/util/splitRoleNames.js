"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitRoleNames = void 0;
function splitRoleNames(roleNames) {
    return roleNames
        .map(v => v.split(/[\s,]+/))
        .flat()
        .filter(Boolean);
}
exports.splitRoleNames = splitRoleNames;
