"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRecentUserActions = void 0;
function clearRecentUserActions(pluginData, type, userId, actionGroupId) {
    pluginData.state.recentActions = pluginData.state.recentActions.filter(action => {
        return action.type !== type || action.userId !== userId || action.actionGroupId !== actionGroupId;
    });
}
exports.clearRecentUserActions = clearRecentUserActions;
