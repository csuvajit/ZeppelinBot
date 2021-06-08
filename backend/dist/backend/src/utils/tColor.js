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
exports.tColor = void 0;
const t = __importStar(require("io-ts"));
const Either_1 = require("fp-ts/lib/Either");
const parseColor_1 = require("./parseColor");
const rgbToInt_1 = require("./rgbToInt");
const intToRgb_1 = require("./intToRgb");
exports.tColor = new t.Type("tColor", (s) => typeof s === "number", (from, to) => Either_1.either.chain(t.string.validate(from, to), input => {
    const parsedColor = parseColor_1.parseColor(input);
    return parsedColor == null ? t.failure(from, to, "Invalid color") : t.success(rgbToInt_1.rgbToInt(parsedColor));
}), s => intToRgb_1.intToRgb(s).join(","));
