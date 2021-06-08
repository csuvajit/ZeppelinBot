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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchWordsTrigger = void 0;
const t = __importStar(require("io-ts"));
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const matchMultipleTextTypesOnMessage_1 = require("../functions/matchMultipleTextTypesOnMessage");
const getTextMatchPartialSummary_1 = require("../functions/getTextMatchPartialSummary");
const normalizeText_1 = require("../../../utils/normalizeText");
const stripMarkdown_1 = require("../../../utils/stripMarkdown");
exports.MatchWordsTrigger = helpers_1.automodTrigger()({
    configType: t.type({
        words: t.array(t.string),
        case_sensitive: t.boolean,
        only_full_words: t.boolean,
        normalize: t.boolean,
        loose_matching: t.boolean,
        loose_matching_threshold: t.number,
        strip_markdown: t.boolean,
        match_messages: t.boolean,
        match_embeds: t.boolean,
        match_visible_names: t.boolean,
        match_usernames: t.boolean,
        match_nicknames: t.boolean,
        match_custom_status: t.boolean,
    }),
    defaultConfig: {
        case_sensitive: false,
        only_full_words: true,
        normalize: false,
        loose_matching: false,
        loose_matching_threshold: 4,
        strip_markdown: false,
        match_messages: true,
        match_embeds: false,
        match_visible_names: false,
        match_usernames: false,
        match_nicknames: false,
        match_custom_status: false,
    },
    async match({ pluginData, context, triggerConfig: trigger }) {
        if (!context.message) {
            return;
        }
        for await (let [type, str] of matchMultipleTextTypesOnMessage_1.matchMultipleTextTypesOnMessage(pluginData, trigger, context.message)) {
            if (trigger.strip_markdown) {
                str = stripMarkdown_1.stripMarkdown(str);
            }
            if (trigger.normalize) {
                str = normalizeText_1.normalizeText(str);
            }
            const looseMatchingThreshold = Math.min(Math.max(trigger.loose_matching_threshold, 1), 64);
            for (const word of trigger.words) {
                // When performing loose matching, allow any amount of whitespace or up to looseMatchingThreshold number of other
                // characters between the matched characters. E.g. if we're matching banana, a loose match could also match b a n a n a
                let pattern = trigger.loose_matching
                    ? [...word].map(c => escape_string_regexp_1.default(c)).join(`(?:\\s*|.{0,${looseMatchingThreshold})`)
                    : escape_string_regexp_1.default(word);
                if (trigger.only_full_words) {
                    pattern = `\\b${pattern}\\b`;
                }
                const regex = new RegExp(pattern, trigger.case_sensitive ? "" : "i");
                const test = regex.test(str);
                if (test) {
                    return {
                        extra: {
                            word,
                            type,
                        },
                    };
                }
            }
        }
        return null;
    },
    renderMatchInformation({ pluginData, contexts, matchResult }) {
        const partialSummary = getTextMatchPartialSummary_1.getTextMatchPartialSummary(pluginData, matchResult.extra.type, contexts[0]);
        return `Matched word \`${utils_1.disableInlineCode(matchResult.extra.word)}\` in ${partialSummary}`;
    },
});
