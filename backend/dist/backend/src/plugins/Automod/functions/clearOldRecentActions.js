"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldRecentActions = void 0;
const constants_1 = require("../constants");
function clearOldRecentActions(pluginData) {
    const now = Date.now();
    pluginData.state.recentActions = pluginData.state.recentActions.filter(info => {
        return info.context.timestamp + constants_1.RECENT_ACTION_EXPIRY_TIME > now;
    });
}
exports.clearOldRecentActions = clearOldRecentActions;
