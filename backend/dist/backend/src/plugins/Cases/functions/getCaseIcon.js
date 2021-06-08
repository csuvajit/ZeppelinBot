"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseIcon = void 0;
const CaseTypes_1 = require("../../../data/CaseTypes");
const caseIcons_1 = require("../caseIcons");
function getCaseIcon(pluginData, caseType) {
    return pluginData.config.get().case_icons?.[CaseTypes_1.CaseTypeToName[caseType]] ?? caseIcons_1.caseIcons[caseType];
}
exports.getCaseIcon = getCaseIcon;
