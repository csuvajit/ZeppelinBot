"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRecentSpam = void 0;
function findRecentSpam(pluginData, type, identifier) {
    return pluginData.state.recentSpam.find(spam => {
        return spam.type === type && (!identifier || spam.identifiers.includes(identifier));
    });
}
exports.findRecentSpam = findRecentSpam;
