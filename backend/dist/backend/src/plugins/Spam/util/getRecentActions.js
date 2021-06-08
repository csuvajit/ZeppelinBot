"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActions = void 0;
function getRecentActions(pluginData, type, userId, actionGroupId, since) {
    return pluginData.state.recentActions.filter(action => {
        if (action.timestamp < since)
            return false;
        if (action.type !== type)
            return false;
        if (action.actionGroupId !== actionGroupId)
            return false;
        if (action.userId !== userId)
            return false;
        return true;
    });
}
exports.getRecentActions = getRecentActions;
