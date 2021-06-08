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
exports.tagsEvt = exports.tagsCmd = exports.ConfigSchema = exports.TagCategory = exports.Tag = void 0;
const t = __importStar(require("io-ts"));
const knub_1 = require("knub");
const utils_1 = require("../../utils");
exports.Tag = t.union([t.string, utils_1.tEmbed]);
exports.TagCategory = t.type({
    prefix: utils_1.tNullable(t.string),
    delete_with_command: utils_1.tNullable(t.boolean),
    user_tag_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    user_category_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    global_tag_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    allow_mentions: utils_1.tNullable(t.boolean),
    global_category_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    auto_delete_command: utils_1.tNullable(t.boolean),
    tags: t.record(t.string, exports.Tag),
    can_use: utils_1.tNullable(t.boolean),
});
exports.ConfigSchema = t.type({
    prefix: t.string,
    delete_with_command: t.boolean,
    user_tag_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    global_tag_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    user_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    allow_mentions: t.boolean,
    global_cooldown: utils_1.tNullable(t.union([t.string, t.number])),
    auto_delete_command: t.boolean,
    categories: t.record(t.string, exports.TagCategory),
    can_create: t.boolean,
    can_use: t.boolean,
    can_list: t.boolean,
});
exports.tagsCmd = knub_1.typedGuildCommand();
exports.tagsEvt = knub_1.typedGuildEventListener();
