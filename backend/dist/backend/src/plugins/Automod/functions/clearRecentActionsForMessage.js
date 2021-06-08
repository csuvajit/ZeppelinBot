"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRecentActionsForMessage = void 0;
function clearRecentActionsForMessage(pluginData, context) {
    const message = context.message;
    const globalIdentifier = message.user_id;
    const perChannelIdentifier = `${message.channel_id}-${message.user_id}`;
    pluginData.state.recentActions = pluginData.state.recentActions.filter(act => {
        return act.identifier !== globalIdentifier && act.identifier !== perChannelIdentifier;
    });
}
exports.clearRecentActionsForMessage = clearRecentActionsForMessage;
