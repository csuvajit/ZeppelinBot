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
exports.mutesEvt = exports.mutesCmd = exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../utils");
const knub_1 = require("knub");
exports.ConfigSchema = t.type({
    mute_role: utils_1.tNullable(t.string),
    move_to_voice_channel: utils_1.tNullable(t.string),
    kick_from_voice_channel: t.boolean,
    dm_on_mute: t.boolean,
    dm_on_update: t.boolean,
    message_on_mute: t.boolean,
    message_on_update: t.boolean,
    message_channel: utils_1.tNullable(t.string),
    mute_message: utils_1.tNullable(t.string),
    timed_mute_message: utils_1.tNullable(t.string),
    update_mute_message: utils_1.tNullable(t.string),
    remove_roles_on_mute: t.union([t.boolean, t.array(t.string)]),
    restore_roles_on_mute: t.union([t.boolean, t.array(t.string)]),
    can_view_list: t.boolean,
    can_cleanup: t.boolean,
});
exports.mutesCmd = knub_1.typedGuildCommand();
exports.mutesEvt = knub_1.typedGuildEventListener();
