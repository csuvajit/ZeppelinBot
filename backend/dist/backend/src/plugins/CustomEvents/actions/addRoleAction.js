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
exports.addRoleAction = exports.AddRoleAction = void 0;
const t = __importStar(require("io-ts"));
const templateFormatter_1 = require("../../../templateFormatter");
const utils_1 = require("../../../utils");
const ActionError_1 = require("../ActionError");
const pluginUtils_1 = require("../../../pluginUtils");
exports.AddRoleAction = t.type({
    type: t.literal("add_role"),
    target: t.string,
    role: t.union([t.string, t.array(t.string)]),
});
async function addRoleAction(pluginData, action, values, event, eventData) {
    const targetId = await templateFormatter_1.renderTemplate(action.target, values, false);
    const target = await utils_1.resolveMember(pluginData.client, pluginData.guild, targetId);
    if (!target)
        throw new ActionError_1.ActionError(`Unknown target member: ${targetId}`);
    if (event.trigger.type === "command" && !pluginUtils_1.canActOn(pluginData, eventData.msg.member, target)) {
        throw new ActionError_1.ActionError("Missing permissions");
    }
    const rolesToAdd = Array.isArray(action.role) ? action.role : [action.role];
    await target.edit({
        roles: Array.from(new Set([...target.roles, ...rolesToAdd])),
    });
}
exports.addRoleAction = addRoleAction;
