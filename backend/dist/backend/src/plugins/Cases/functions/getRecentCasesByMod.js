"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentCasesByMod = void 0;
function getRecentCasesByMod(pluginData, modId, count, skip = 0) {
    return pluginData.state.cases.getRecentByModId(modId, count, skip);
}
exports.getRecentCasesByMod = getRecentCasesByMod;
