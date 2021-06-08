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
exports.AvailableActions = exports.availableActions = void 0;
const t = __importStar(require("io-ts"));
const clean_1 = require("./clean");
const warn_1 = require("./warn");
const mute_1 = require("./mute");
const kick_1 = require("./kick");
const ban_1 = require("./ban");
const alert_1 = require("./alert");
const changeNickname_1 = require("./changeNickname");
const log_1 = require("./log");
const addRoles_1 = require("./addRoles");
const removeRoles_1 = require("./removeRoles");
const setAntiraidLevel_1 = require("./setAntiraidLevel");
const reply_1 = require("./reply");
const addToCounter_1 = require("./addToCounter");
const setCounter_1 = require("./setCounter");
const setSlowmode_1 = require("./setSlowmode");
exports.availableActions = {
    clean: clean_1.CleanAction,
    warn: warn_1.WarnAction,
    mute: mute_1.MuteAction,
    kick: kick_1.KickAction,
    ban: ban_1.BanAction,
    alert: alert_1.AlertAction,
    change_nickname: changeNickname_1.ChangeNicknameAction,
    log: log_1.LogAction,
    add_roles: addRoles_1.AddRolesAction,
    remove_roles: removeRoles_1.RemoveRolesAction,
    set_antiraid_level: setAntiraidLevel_1.SetAntiraidLevelAction,
    reply: reply_1.ReplyAction,
    add_to_counter: addToCounter_1.AddToCounterAction,
    set_counter: setCounter_1.SetCounterAction,
    set_slowmode: setSlowmode_1.SetSlowmodeAction,
};
exports.AvailableActions = t.type({
    clean: clean_1.CleanAction.configType,
    warn: warn_1.WarnAction.configType,
    mute: mute_1.MuteAction.configType,
    kick: kick_1.KickAction.configType,
    ban: ban_1.BanAction.configType,
    alert: alert_1.AlertAction.configType,
    change_nickname: changeNickname_1.ChangeNicknameAction.configType,
    log: log_1.LogAction.configType,
    add_roles: addRoles_1.AddRolesAction.configType,
    remove_roles: removeRoles_1.RemoveRolesAction.configType,
    set_antiraid_level: setAntiraidLevel_1.SetAntiraidLevelAction.configType,
    reply: reply_1.ReplyAction.configType,
    add_to_counter: addToCounter_1.AddToCounterAction.configType,
    set_counter: setCounter_1.SetCounterAction.configType,
    set_slowmode: setSlowmode_1.SetSlowmodeAction.configType,
});
