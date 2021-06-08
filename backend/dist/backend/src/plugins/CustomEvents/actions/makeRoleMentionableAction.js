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
exports.makeRoleMentionableAction = exports.MakeRoleMentionableAction = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../../utils");
const ActionError_1 = require("../ActionError");
exports.MakeRoleMentionableAction = t.type({
    type: t.literal("make_role_mentionable"),
    role: t.string,
    timeout: utils_1.tDelayString,
});
async function makeRoleMentionableAction(pluginData, action, values, event, eventData) {
    const role = pluginData.guild.roles.get(action.role);
    if (!role) {
        throw new ActionError_1.ActionError(`Unknown role: ${role}`);
    }
    await role.edit({
        mentionable: true,
    }, `Custom event: ${event.name}`);
    const timeout = utils_1.convertDelayStringToMS(action.timeout);
    setTimeout(() => {
        role
            .edit({
            mentionable: false,
        }, `Custom event: ${event.name}`)
            .catch(utils_1.noop);
    }, timeout);
}
exports.makeRoleMentionableAction = makeRoleMentionableAction;
