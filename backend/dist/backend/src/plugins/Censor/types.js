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
exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../utils");
const validatorUtils_1 = require("../../validatorUtils");
exports.ConfigSchema = t.type({
    filter_zalgo: t.boolean,
    filter_invites: t.boolean,
    invite_guild_whitelist: utils_1.tNullable(t.array(t.string)),
    invite_guild_blacklist: utils_1.tNullable(t.array(t.string)),
    invite_code_whitelist: utils_1.tNullable(t.array(t.string)),
    invite_code_blacklist: utils_1.tNullable(t.array(t.string)),
    allow_group_dm_invites: t.boolean,
    filter_domains: t.boolean,
    domain_whitelist: utils_1.tNullable(t.array(t.string)),
    domain_blacklist: utils_1.tNullable(t.array(t.string)),
    blocked_tokens: utils_1.tNullable(t.array(t.string)),
    blocked_words: utils_1.tNullable(t.array(t.string)),
    blocked_regex: utils_1.tNullable(t.array(validatorUtils_1.TRegex)),
});
