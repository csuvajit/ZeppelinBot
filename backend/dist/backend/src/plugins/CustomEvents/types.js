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
exports.ConfigSchema = exports.CustomEvent = void 0;
const t = __importStar(require("io-ts"));
const addRoleAction_1 = require("./actions/addRoleAction");
const createCaseAction_1 = require("./actions/createCaseAction");
const moveToVoiceChannelAction_1 = require("./actions/moveToVoiceChannelAction");
const messageAction_1 = require("./actions/messageAction");
const makeRoleMentionableAction_1 = require("./actions/makeRoleMentionableAction");
const makeRoleUnmentionableAction_1 = require("./actions/makeRoleUnmentionableAction");
const setChannelPermissionOverrides_1 = require("./actions/setChannelPermissionOverrides");
// Triggers
const CommandTrigger = t.type({
    type: t.literal("command"),
    name: t.string,
    params: t.string,
    can_use: t.boolean,
});
const AnyTrigger = CommandTrigger; // TODO: Make into a union once we have more triggers
const AnyAction = t.union([
    addRoleAction_1.AddRoleAction,
    createCaseAction_1.CreateCaseAction,
    moveToVoiceChannelAction_1.MoveToVoiceChannelAction,
    messageAction_1.MessageAction,
    makeRoleMentionableAction_1.MakeRoleMentionableAction,
    makeRoleUnmentionableAction_1.MakeRoleUnmentionableAction,
    setChannelPermissionOverrides_1.SetChannelPermissionOverridesAction,
]);
exports.CustomEvent = t.type({
    name: t.string,
    trigger: AnyTrigger,
    actions: t.array(AnyAction),
});
exports.ConfigSchema = t.type({
    events: t.record(t.string, exports.CustomEvent),
});
