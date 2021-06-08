"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRecentAction = void 0;
function addRecentAction(pluginData, type, userId, actionGroupId, extraData, timestamp, count = 1) {
    pluginData.state.recentActions.push({ type, userId, actionGroupId, extraData, timestamp, count });
}
exports.addRecentAction = addRecentAction;
