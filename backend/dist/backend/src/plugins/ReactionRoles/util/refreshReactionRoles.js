"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshReactionRoles = void 0;
const applyReactionRoleReactionsToMessage_1 = require("./applyReactionRoleReactionsToMessage");
async function refreshReactionRoles(pluginData, channelId, messageId) {
    const pendingKey = `${channelId}-${messageId}`;
    if (pluginData.state.pendingRefreshes.has(pendingKey))
        return;
    pluginData.state.pendingRefreshes.add(pendingKey);
    try {
        const reactionRoles = await pluginData.state.reactionRoles.getForMessage(messageId);
        await applyReactionRoleReactionsToMessage_1.applyReactionRoleReactionsToMessage(pluginData, channelId, messageId, reactionRoles);
    }
    finally {
        pluginData.state.pendingRefreshes.delete(pendingKey);
    }
}
exports.refreshReactionRoles = refreshReactionRoles;
