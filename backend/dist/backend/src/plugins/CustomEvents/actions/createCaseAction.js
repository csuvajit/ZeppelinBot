"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaseAction = exports.CreateCaseAction = void 0;
const t = __importStar(require("io-ts"));
const templateFormatter_1 = require("../../../templateFormatter");
const CaseTypes_1 = require("../../../data/CaseTypes");
const ActionError_1 = require("../ActionError");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
exports.CreateCaseAction = t.type({
    type: t.literal("create_case"),
    case_type: t.string,
    mod: t.string,
    target: t.string,
    reason: t.string,
});
async function createCaseAction(pluginData, action, values, event, eventData) {
    const modId = await templateFormatter_1.renderTemplate(action.mod, values, false);
    const targetId = await templateFormatter_1.renderTemplate(action.target, values, false);
    const reason = await templateFormatter_1.renderTemplate(action.reason, values, false);
    if (CaseTypes_1.CaseTypes[action.case_type] == null) {
        throw new ActionError_1.ActionError(`Invalid case type: ${action.type}`);
    }
    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
    await casesPlugin.createCase({
        userId: targetId,
        modId,
        type: CaseTypes_1.CaseTypes[action.case_type],
        reason: `__[${event.name}]__ ${reason}`,
    });
}
exports.createCaseAction = createCaseAction;
