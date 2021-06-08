"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRoleNames = void 0;
function normalizeRoleNames(roleNames) {
    return roleNames.map(v => v.toLowerCase());
}
exports.normalizeRoleNames = normalizeRoleNames;
