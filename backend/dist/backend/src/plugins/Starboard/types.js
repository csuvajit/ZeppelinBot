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
exports.starboardEvt = exports.starboardCmd = exports.defaultStarboardOpts = exports.PartialConfigSchema = exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const knub_1 = require("knub");
const utils_1 = require("../../utils");
const StarboardOpts = t.type({
    channel_id: t.string,
    stars_required: t.number,
    star_emoji: utils_1.tNullable(t.array(t.string)),
    copy_full_embed: utils_1.tNullable(t.boolean),
    enabled: utils_1.tNullable(t.boolean),
    show_star_count: t.boolean,
    color: utils_1.tNullable(t.number),
});
exports.ConfigSchema = t.type({
    boards: t.record(t.string, StarboardOpts),
    can_migrate: t.boolean,
});
exports.PartialConfigSchema = utils_1.tDeepPartial(exports.ConfigSchema);
exports.defaultStarboardOpts = {
    star_emoji: ["⭐"],
    enabled: true,
    show_star_count: true,
    color: null,
};
exports.starboardCmd = knub_1.typedGuildCommand();
exports.starboardEvt = knub_1.typedGuildEventListener();
