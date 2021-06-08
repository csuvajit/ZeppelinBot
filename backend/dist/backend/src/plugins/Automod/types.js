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
exports.ConfigSchema = exports.Rule = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../utils");
const availableTriggers_1 = require("./triggers/availableTriggers");
const availableActions_1 = require("./actions/availableActions");
exports.Rule = t.type({
    enabled: t.boolean,
    name: t.string,
    presets: utils_1.tNullable(t.array(t.string)),
    affects_bots: t.boolean,
    triggers: t.array(t.partial(availableTriggers_1.AvailableTriggers.props)),
    actions: t.partial(availableActions_1.AvailableActions.props),
    cooldown: utils_1.tNullable(t.string),
});
exports.ConfigSchema = t.type({
    rules: t.record(t.string, exports.Rule),
    antiraid_levels: t.array(t.string),
    can_set_antiraid: t.boolean,
    can_view_antiraid: t.boolean,
});
