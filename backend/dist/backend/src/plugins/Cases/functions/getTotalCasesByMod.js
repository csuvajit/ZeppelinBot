"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalCasesByMod = void 0;
function getTotalCasesByMod(pluginData, modId) {
    return pluginData.state.cases.getTotalCasesByModId(modId);
}
exports.getTotalCasesByMod = getTotalCasesByMod;
