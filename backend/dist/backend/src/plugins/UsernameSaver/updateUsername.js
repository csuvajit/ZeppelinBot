"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsername = void 0;
async function updateUsername(pluginData, user) {
    if (!user)
        return;
    const newUsername = `${user.username}#${user.discriminator}`;
    const latestEntry = await pluginData.state.usernameHistory.getLastEntry(user.id);
    if (!latestEntry || newUsername !== latestEntry.username) {
        await pluginData.state.usernameHistory.addEntry(user.id, newUsername);
    }
}
exports.updateUsername = updateUsername;
