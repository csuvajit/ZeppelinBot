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
exports.logsEvt = exports.FORMAT_NO_TIMESTAMP = exports.ConfigSchema = exports.tLogFormats = void 0;
const t = __importStar(require("io-ts"));
const knub_1 = require("knub");
const validatorUtils_1 = require("../../validatorUtils");
const utils_1 = require("../../utils");
exports.tLogFormats = t.record(t.string, t.union([t.string, utils_1.tMessageContent]));
const LogChannel = t.partial({
    include: t.array(t.string),
    exclude: t.array(t.string),
    batched: t.boolean,
    batch_time: t.number,
    excluded_users: t.array(t.string),
    excluded_message_regexes: t.array(validatorUtils_1.TRegex),
    excluded_channels: t.array(t.string),
    excluded_categories: t.array(t.string),
    exclude_bots: t.boolean,
    excluded_roles: t.array(t.string),
    format: utils_1.tNullable(exports.tLogFormats),
    timestamp_format: t.string,
    include_embed_timestamp: t.boolean,
});
const LogChannelMap = t.record(t.string, LogChannel);
exports.ConfigSchema = t.type({
    channels: LogChannelMap,
    format: t.intersection([
        exports.tLogFormats,
        t.type({
            timestamp: t.string,
        }),
    ]),
    ping_user: t.boolean,
    allow_user_mentions: t.boolean,
    timestamp_format: t.string,
    include_embed_timestamp: t.boolean,
});
// Hacky way of allowing a """null""" default value for config.format.timestamp
// The type cannot be made nullable properly because io-ts's intersection type still considers
// that it has to match the record type of tLogFormats, which includes string.
exports.FORMAT_NO_TIMESTAMP = "__NO_TIMESTAMP__";
exports.logsEvt = knub_1.typedGuildEventListener();
