"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNickname = void 0;
async function updateNickname(pluginData, member) {
    if (!member)
        return;
    const latestEntry = await pluginData.state.nicknameHistory.getLastEntry(member.id);
    if (!latestEntry || latestEntry.nickname !== member.nick) {
        if (!latestEntry && member.nick == null)
            return; // No need to save "no nickname" if there's no previous data
        await pluginData.state.nicknameHistory.addEntry(member.id, member.nick);
    }
}
exports.updateNickname = updateNickname;
