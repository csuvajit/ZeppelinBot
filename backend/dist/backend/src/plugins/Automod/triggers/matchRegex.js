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
exports.MatchRegexTrigger = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const matchMultipleTextTypesOnMessage_1 = require("../functions/matchMultipleTextTypesOnMessage");
const getTextMatchPartialSummary_1 = require("../functions/getTextMatchPartialSummary");
const RegExpRunner_1 = require("../../../RegExpRunner");
const validatorUtils_1 = require("../../../validatorUtils");
const normalizeText_1 = require("../../../utils/normalizeText");
const stripMarkdown_1 = require("../../../utils/stripMarkdown");
exports.MatchRegexTrigger = helpers_1.automodTrigger()({
    configType: t.type({
        patterns: t.array(validatorUtils_1.TRegex),
        case_sensitive: t.boolean,
        normalize: t.boolean,
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
        normalize: false,
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
            for (const sourceRegex of trigger.patterns) {
                const regex = new RegExp(sourceRegex.source, trigger.case_sensitive && !sourceRegex.ignoreCase ? "" : "i");
                const matches = await pluginData.state.regexRunner.exec(regex, str).catch(RegExpRunner_1.allowTimeout);
                if (matches?.length) {
                    return {
                        extra: {
                            pattern: sourceRegex.source,
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
        return `Matched regex \`${utils_1.disableInlineCode(matchResult.extra.pattern)}\` in ${partialSummary}`;
    },
});
