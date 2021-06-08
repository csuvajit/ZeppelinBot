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
exports.spamEvt = exports.RecentActionType = exports.ConfigSchema = void 0;
const t = __importStar(require("io-ts"));
const knub_1 = require("knub");
const utils_1 = require("../../utils");
const BaseSingleSpamConfig = t.type({
    interval: t.number,
    count: t.number,
    mute: utils_1.tNullable(t.boolean),
    mute_time: utils_1.tNullable(t.number),
    remove_roles_on_mute: utils_1.tNullable(t.union([t.boolean, t.array(t.string)])),
    restore_roles_on_mute: utils_1.tNullable(t.union([t.boolean, t.array(t.string)])),
    clean: utils_1.tNullable(t.boolean),
});
exports.ConfigSchema = t.type({
    max_censor: utils_1.tNullable(BaseSingleSpamConfig),
    max_messages: utils_1.tNullable(BaseSingleSpamConfig),
    max_mentions: utils_1.tNullable(BaseSingleSpamConfig),
    max_links: utils_1.tNullable(BaseSingleSpamConfig),
    max_attachments: utils_1.tNullable(BaseSingleSpamConfig),
    max_emojis: utils_1.tNullable(BaseSingleSpamConfig),
    max_newlines: utils_1.tNullable(BaseSingleSpamConfig),
    max_duplicates: utils_1.tNullable(BaseSingleSpamConfig),
    max_characters: utils_1.tNullable(BaseSingleSpamConfig),
    max_voice_moves: utils_1.tNullable(BaseSingleSpamConfig),
});
var RecentActionType;
(function (RecentActionType) {
    RecentActionType[RecentActionType["Message"] = 1] = "Message";
    RecentActionType[RecentActionType["Mention"] = 2] = "Mention";
    RecentActionType[RecentActionType["Link"] = 3] = "Link";
    RecentActionType[RecentActionType["Attachment"] = 4] = "Attachment";
    RecentActionType[RecentActionType["Emoji"] = 5] = "Emoji";
    RecentActionType[RecentActionType["Newline"] = 6] = "Newline";
    RecentActionType[RecentActionType["Censor"] = 7] = "Censor";
    RecentActionType[RecentActionType["Character"] = 8] = "Character";
    RecentActionType[RecentActionType["VoiceChannelMove"] = 9] = "VoiceChannelMove";
})(RecentActionType = exports.RecentActionType || (exports.RecentActionType = {}));
exports.spamEvt = knub_1.typedGuildEventListener();
