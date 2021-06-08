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
exports.ZeppelinGlobalConfigSchema = exports.PartialZeppelinGuildConfigSchema = exports.ZeppelinGuildConfigSchema = void 0;
const t = __importStar(require("io-ts"));
exports.ZeppelinGuildConfigSchema = t.type({
    // From BaseConfig
    prefix: t.string,
    levels: t.record(t.string, t.number),
    plugins: t.record(t.string, t.unknown),
    // From ZeppelinGuildConfig
    success_emoji: t.string,
    error_emoji: t.string,
    // Deprecated
    timezone: t.string,
    date_formats: t.unknown,
});
exports.PartialZeppelinGuildConfigSchema = t.partial(exports.ZeppelinGuildConfigSchema.props);
exports.ZeppelinGlobalConfigSchema = t.type({
    url: t.string,
    owners: t.array(t.string),
    plugins: t.record(t.string, t.unknown),
});
