"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserIdFromActiveAlerts = void 0;
async function removeUserIdFromActiveAlerts(pluginData, userId) {
    const index = pluginData.state.usersWithAlerts.indexOf(userId);
    if (index > -1) {
        pluginData.state.usersWithAlerts.splice(index, 1);
    }
}
exports.removeUserIdFromActiveAlerts = removeUserIdFromActiveAlerts;
