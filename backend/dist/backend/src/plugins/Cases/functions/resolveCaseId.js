"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCaseId = void 0;
const Case_1 = require("../../../data/entities/Case");
function resolveCaseId(caseOrCaseId) {
    return caseOrCaseId instanceof Case_1.Case ? caseOrCaseId.id : caseOrCaseId;
}
exports.resolveCaseId = resolveCaseId;
