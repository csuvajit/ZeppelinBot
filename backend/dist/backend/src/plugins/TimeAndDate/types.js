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
exports.timeAndDateCmd = exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../utils");
const knub_1 = require("knub");
const tValidTimezone_1 = require("../../utils/tValidTimezone");
const defaultDateFormats_1 = require("./defaultDateFormats");
exports.ConfigSchema = t.type({
    timezone: tValidTimezone_1.tValidTimezone,
    date_formats: utils_1.tNullable(utils_1.tPartialDictionary(t.keyof(defaultDateFormats_1.defaultDateFormats), t.string)),
    can_set_timezone: t.boolean,
});
exports.timeAndDateCmd = knub_1.typedGuildCommand();
