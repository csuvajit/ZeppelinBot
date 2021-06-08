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
exports.modActionsEvt = exports.modActionsCmd = exports.IgnoredEventType = exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../utils");
const knub_1 = require("knub");
exports.ConfigSchema = t.type({
    dm_on_warn: t.boolean,
    dm_on_kick: t.boolean,
    dm_on_ban: t.boolean,
    message_on_warn: t.boolean,
    message_on_kick: t.boolean,
    message_on_ban: t.boolean,
    message_channel: utils_1.tNullable(t.string),
    warn_message: utils_1.tNullable(t.string),
    kick_message: utils_1.tNullable(t.string),
    ban_message: utils_1.tNullable(t.string),
    tempban_message: utils_1.tNullable(t.string),
    alert_on_rejoin: t.boolean,
    alert_channel: utils_1.tNullable(t.string),
    warn_notify_enabled: t.boolean,
    warn_notify_threshold: t.number,
    warn_notify_message: t.string,
    ban_delete_message_days: t.number,
    can_note: t.boolean,
    can_warn: t.boolean,
    can_mute: t.boolean,
    can_kick: t.boolean,
    can_ban: t.boolean,
    can_unban: t.boolean,
    can_view: t.boolean,
    can_addcase: t.boolean,
    can_massunban: t.boolean,
    can_massban: t.boolean,
    can_massmute: t.boolean,
    can_hidecase: t.boolean,
    can_deletecase: t.boolean,
    can_act_as_other: t.boolean,
    create_cases_for_manual_actions: t.boolean,
});
var IgnoredEventType;
(function (IgnoredEventType) {
    IgnoredEventType[IgnoredEventType["Ban"] = 1] = "Ban";
    IgnoredEventType[IgnoredEventType["Unban"] = 2] = "Unban";
    IgnoredEventType[IgnoredEventType["Kick"] = 3] = "Kick";
})(IgnoredEventType = exports.IgnoredEventType || (exports.IgnoredEventType = {}));
exports.modActionsCmd = knub_1.typedGuildCommand();
exports.modActionsEvt = knub_1.typedGuildEventListener();
