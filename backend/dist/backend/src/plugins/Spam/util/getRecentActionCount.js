"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActionCount = void 0;
function getRecentActionCount(pluginData, type, userId, actionGroupId, since) {
    return pluginData.state.recentActions.reduce((count, action) => {
        if (action.timestamp < since)
            return count;
        if (action.type !== type)
            return count;
        if (action.actionGroupId !== actionGroupId)
            return count;
        if (action.userId !== userId)
            return count;
        return count + action.count;
    }, 0);
}
exports.getRecentActionCount = getRecentActionCount;
