"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldRecentSpam = void 0;
const constants_1 = require("../constants");
function clearOldRecentSpam(pluginData) {
    const now = Date.now();
    pluginData.state.recentSpam = pluginData.state.recentSpam.filter(spam => {
        return spam.timestamp + constants_1.RECENT_SPAM_EXPIRY_TIME > now;
    });
}
exports.clearOldRecentSpam = clearOldRecentSpam;
