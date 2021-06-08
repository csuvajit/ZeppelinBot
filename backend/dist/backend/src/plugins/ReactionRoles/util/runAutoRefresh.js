"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutoRefresh = void 0;
const refreshReactionRoles_1 = require("./refreshReactionRoles");
async function runAutoRefresh(pluginData) {
    // Refresh reaction roles on all reaction role messages
    const reactionRoles = await pluginData.state.reactionRoles.all();
    const idPairs = new Set(reactionRoles.map(r => `${r.channel_id}-${r.message_id}`));
    for (const pair of idPairs) {
        const [channelId, messageId] = pair.split("-");
        await refreshReactionRoles_1.refreshReactionRoles(pluginData, channelId, messageId);
    }
}
exports.runAutoRefresh = runAutoRefresh;
