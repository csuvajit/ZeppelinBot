"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchingRecentActions = void 0;
function getMatchingRecentActions(pluginData, type, identifier, since, to) {
    to = to || Date.now();
    return pluginData.state.recentActions.filter(action => {
        return (action.type === type &&
            (!identifier || action.identifier === identifier) &&
            action.context.timestamp >= since &&
            action.context.timestamp <= to &&
            !action.context.actioned);
    });
}
exports.getMatchingRecentActions = getMatchingRecentActions;
