"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeIgnoredRoleChange = exports.ignoreRoleChange = void 0;
const utils_1 = require("../../../utils");
const IGNORED_ROLE_CHANGE_LIFETIME = 5 * utils_1.MINUTES;
function cleanupIgnoredRoleChanges(pluginData) {
    const cutoff = Date.now() - IGNORED_ROLE_CHANGE_LIFETIME;
    for (const ignoredChange of pluginData.state.ignoredRoleChanges.values()) {
        if (ignoredChange.timestamp < cutoff) {
            pluginData.state.ignoredRoleChanges.delete(ignoredChange);
        }
    }
}
function ignoreRoleChange(pluginData, memberId, roleId) {
    pluginData.state.ignoredRoleChanges.add({
        memberId,
        roleId,
        timestamp: Date.now(),
    });
    cleanupIgnoredRoleChanges(pluginData);
}
exports.ignoreRoleChange = ignoreRoleChange;
/**
 * @return Whether the role change should be ignored
 */
function consumeIgnoredRoleChange(pluginData, memberId, roleId) {
    for (const ignoredChange of pluginData.state.ignoredRoleChanges.values()) {
        if (ignoredChange.memberId === memberId && ignoredChange.roleId === roleId) {
            pluginData.state.ignoredRoleChanges.delete(ignoredChange);
            return true;
        }
    }
    return false;
}
exports.consumeIgnoredRoleChange = consumeIgnoredRoleChange;
