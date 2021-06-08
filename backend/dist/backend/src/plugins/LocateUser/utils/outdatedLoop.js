"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outdatedAlertsLoop = void 0;
const utils_1 = require("../../../utils");
const removeUserIdFromActiveAlerts_1 = require("./removeUserIdFromActiveAlerts");
const ALERT_LOOP_TIME = 30 * utils_1.SECONDS;
async function outdatedAlertsLoop(pluginData) {
    const outdatedAlerts = await pluginData.state.alerts.getOutdatedAlerts();
    for (const alert of outdatedAlerts) {
        await pluginData.state.alerts.delete(alert.id);
        await removeUserIdFromActiveAlerts_1.removeUserIdFromActiveAlerts(pluginData, alert.user_id);
    }
    if (!pluginData.state.unloaded) {
        pluginData.state.outdatedAlertsTimeout = setTimeout(() => outdatedAlertsLoop(pluginData), ALERT_LOOP_TIME);
    }
}
exports.outdatedAlertsLoop = outdatedAlertsLoop;
