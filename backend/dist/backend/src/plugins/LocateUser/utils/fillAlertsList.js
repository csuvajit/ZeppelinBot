"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillActiveAlertsList = void 0;
async function fillActiveAlertsList(pluginData) {
    const allAlerts = await pluginData.state.alerts.getAllGuildAlerts();
    allAlerts.forEach(alert => {
        if (!pluginData.state.usersWithAlerts.includes(alert.user_id)) {
            pluginData.state.usersWithAlerts.push(alert.user_id);
        }
    });
}
exports.fillActiveAlertsList = fillActiveAlertsList;
