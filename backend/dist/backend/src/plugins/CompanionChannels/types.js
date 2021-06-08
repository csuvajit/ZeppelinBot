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
exports.companionChannelsEvt = exports.ConfigSchema = exports.CompanionChannelOpts = void 0;
const t = __importStar(require("io-ts"));
const utils_1 = require("../../utils");
const knub_1 = require("knub");
// Permissions using these numbers: https://abal.moe/Eris/docs/reference (add all allowed/denied ones up)
exports.CompanionChannelOpts = t.type({
    voice_channel_ids: t.array(t.string),
    text_channel_ids: t.array(t.string),
    permissions: t.number,
    enabled: utils_1.tNullable(t.boolean),
});
exports.ConfigSchema = t.type({
    entries: t.record(t.string, exports.CompanionChannelOpts),
});
exports.companionChannelsEvt = knub_1.typedGuildEventListener();
