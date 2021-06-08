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
exports.selfGrantableRolesCmd = exports.defaultSelfGrantableRoleEntry = exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const knub_1 = require("knub");
const RoleMap = t.record(t.string, t.array(t.string));
const SelfGrantableRoleEntry = t.type({
    roles: RoleMap,
    can_use: t.boolean,
    can_ignore_cooldown: t.boolean,
    max_roles: t.number,
});
const PartialRoleEntry = t.partial(SelfGrantableRoleEntry.props);
exports.ConfigSchema = t.type({
    entries: t.record(t.string, SelfGrantableRoleEntry),
    mention_roles: t.boolean,
});
exports.defaultSelfGrantableRoleEntry = {
    can_use: false,
    can_ignore_cooldown: false,
    max_roles: 0,
};
exports.selfGrantableRolesCmd = knub_1.typedGuildCommand();
