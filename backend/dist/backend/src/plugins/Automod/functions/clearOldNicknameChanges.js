"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldRecentNicknameChanges = void 0;
const constants_1 = require("../constants");
function clearOldRecentNicknameChanges(pluginData) {
    const now = Date.now();
    for (const [userId, { timestamp }] of pluginData.state.recentNicknameChanges) {
        if (timestamp + constants_1.RECENT_NICKNAME_CHANGE_EXPIRY_TIME <= now) {
            pluginData.state.recentNicknameChanges.delete(userId);
        }
    }
}
exports.clearOldRecentNicknameChanges = clearOldRecentNicknameChanges;
