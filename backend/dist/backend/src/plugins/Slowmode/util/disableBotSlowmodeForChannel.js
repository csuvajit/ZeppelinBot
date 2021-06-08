"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableBotSlowmodeForChannel = void 0;
const clearBotSlowmodeFromUserId_1 = require("./clearBotSlowmodeFromUserId");
async function disableBotSlowmodeForChannel(pluginData, channel) {
    // Disable channel slowmode
    await pluginData.state.slowmodes.deleteChannelSlowmode(channel.id);
    // Remove currently applied slowmodes
    const users = await pluginData.state.slowmodes.getChannelSlowmodeUsers(channel.id);
    const failedUsers = [];
    for (const slowmodeUser of users) {
        try {
            await clearBotSlowmodeFromUserId_1.clearBotSlowmodeFromUserId(pluginData, channel, slowmodeUser.user_id);
        }
        catch {
            // Removing the slowmode failed. Record this so the permissions can be changed manually, and remove the database entry.
            failedUsers.push(slowmodeUser.user_id);
            await pluginData.state.slowmodes.clearSlowmodeUser(channel.id, slowmodeUser.user_id);
        }
    }
    return { failedUsers };
}
exports.disableBotSlowmodeForChannel = disableBotSlowmodeForChannel;
