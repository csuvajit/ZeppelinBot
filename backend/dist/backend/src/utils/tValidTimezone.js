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
exports.tValidTimezone = void 0;
const t = __importStar(require("io-ts"));
const Either_1 = require("fp-ts/lib/Either");
const isValidTimezone_1 = require("./isValidTimezone");
exports.tValidTimezone = new t.Type("tValidTimezone", (s) => typeof s === "string", (from, to) => Either_1.either.chain(t.string.validate(from, to), input => {
    return isValidTimezone_1.isValidTimezone(input) ? t.success(input) : t.failure(from, to, `Invalid timezone: ${input}`);
}), s => s);
