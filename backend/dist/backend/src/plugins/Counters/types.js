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
exports.ConfigSchema = exports.Counter = exports.Trigger = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../utils");
exports.Trigger = t.type({
    name: t.string,
    pretty_name: utils_1.tNullable(t.string),
    condition: t.string,
    reverse_condition: t.string,
});
exports.Counter = t.type({
    name: t.string,
    pretty_name: utils_1.tNullable(t.string),
    per_channel: t.boolean,
    per_user: t.boolean,
    initial_value: t.number,
    triggers: t.record(t.string, t.union([t.string, exports.Trigger])),
    decay: utils_1.tNullable(t.type({
        amount: t.number,
        every: utils_1.tDelayString,
    })),
    can_view: utils_1.tNullable(t.boolean),
    can_edit: utils_1.tNullable(t.boolean),
    can_reset_all: utils_1.tNullable(t.boolean),
});
exports.ConfigSchema = t.type({
    counters: t.record(t.string, exports.Counter),
    can_view: t.boolean,
    can_edit: t.boolean,
    can_reset_all: t.boolean,
});
