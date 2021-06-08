"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseColor = void 0;
const CaseTypes_1 = require("../../../data/CaseTypes");
const caseColors_1 = require("../caseColors");
function getCaseColor(pluginData, caseType) {
    return pluginData.config.get().case_colors?.[CaseTypes_1.CaseTypeToName[caseType]] ?? caseColors_1.caseColors[caseType];
}
exports.getCaseColor = getCaseColor;
