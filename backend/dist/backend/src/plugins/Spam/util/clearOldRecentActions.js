"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldRecentActions = void 0;
const MAX_INTERVAL = 300;
function clearOldRecentActions(pluginData) {
    // TODO: Figure out expiry time from longest interval in the config?
    const expiryTimestamp = Date.now() - 1000 * MAX_INTERVAL;
    pluginData.state.recentActions = pluginData.state.recentActions.filter(action => action.timestamp >= expiryTimestamp);
}
exports.clearOldRecentActions = clearOldRecentActions;
