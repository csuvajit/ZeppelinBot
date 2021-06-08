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
exports.utilityEvt = exports.utilityCmd = exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const knub_1 = require("knub");
exports.ConfigSchema = t.type({
    can_roles: t.boolean,
    can_level: t.boolean,
    can_search: t.boolean,
    can_clean: t.boolean,
    can_info: t.boolean,
    can_server: t.boolean,
    can_inviteinfo: t.boolean,
    can_channelinfo: t.boolean,
    can_messageinfo: t.boolean,
    can_userinfo: t.boolean,
    can_roleinfo: t.boolean,
    can_emojiinfo: t.boolean,
    can_snowflake: t.boolean,
    can_reload_guild: t.boolean,
    can_nickname: t.boolean,
    can_ping: t.boolean,
    can_source: t.boolean,
    can_vcmove: t.boolean,
    can_vckick: t.boolean,
    can_help: t.boolean,
    can_about: t.boolean,
    can_context: t.boolean,
    can_jumbo: t.boolean,
    jumbo_size: t.Integer,
    can_avatar: t.boolean,
    info_on_single_result: t.boolean,
});
exports.utilityCmd = knub_1.typedGuildCommand();
exports.utilityEvt = knub_1.typedGuildEventListener();
