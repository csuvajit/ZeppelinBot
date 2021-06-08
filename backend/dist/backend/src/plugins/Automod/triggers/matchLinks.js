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
exports.MatchLinksTrigger = void 0;
const t = __importStar(require("io-ts"));
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const matchMultipleTextTypesOnMessage_1 = require("../functions/matchMultipleTextTypesOnMessage");
const validatorUtils_1 = require("../../../validatorUtils");
const getTextMatchPartialSummary_1 = require("../functions/getTextMatchPartialSummary");
const RegExpRunner_1 = require("../../../RegExpRunner");
exports.MatchLinksTrigger = helpers_1.automodTrigger()({
    configType: t.type({
        include_domains: utils_1.tNullable(t.array(t.string)),
        exclude_domains: utils_1.tNullable(t.array(t.string)),
        include_subdomains: t.boolean,
        include_words: utils_1.tNullable(t.array(t.string)),
        exclude_words: utils_1.tNullable(t.array(t.string)),
        include_regex: utils_1.tNullable(t.array(validatorUtils_1.TRegex)),
        exclude_regex: utils_1.tNullable(t.array(validatorUtils_1.TRegex)),
        only_real_links: t.boolean,
        match_messages: t.boolean,
        match_embeds: t.boolean,
        match_visible_names: t.boolean,
        match_usernames: t.boolean,
        match_nicknames: t.boolean,
        match_custom_status: t.boolean,
    }),
    defaultConfig: {
        include_subdomains: true,
        match_messages: true,
        match_embeds: false,
        match_visible_names: false,
        match_usernames: false,
        match_nicknames: false,
        match_custom_status: false,
        only_real_links: true,
    },
    async match({ pluginData, context, triggerConfig: trigger }) {
        if (!context.message) {
            return;
        }
        typeLoop: for await (const [type, str] of matchMultipleTextTypesOnMessage_1.matchMultipleTextTypesOnMessage(pluginData, trigger, context.message)) {
            const links = utils_1.getUrlsInString(str, true);
            for (const link of links) {
                // "real link" = a link that Discord highlights
                if (trigger.only_real_links && !link.input.match(/^https?:\/\//i)) {
                    continue;
                }
                const normalizedHostname = link.hostname.toLowerCase();
                // Exclude > Include
                // In order of specificity, regex > word > domain
                if (trigger.exclude_regex) {
                    for (const sourceRegex of trigger.exclude_regex) {
                        const matches = await pluginData.state.regexRunner.exec(sourceRegex, link.input).catch(RegExpRunner_1.allowTimeout);
                        if (matches) {
                            continue typeLoop;
                        }
                    }
                }
                if (trigger.include_regex) {
                    for (const sourceRegex of trigger.include_regex) {
                        const matches = await pluginData.state.regexRunner.exec(sourceRegex, link.input).catch(RegExpRunner_1.allowTimeout);
                        if (matches) {
                            return { extra: { type, link: link.input } };
                        }
                    }
                }
                if (trigger.exclude_words) {
                    for (const word of trigger.exclude_words) {
                        const regex = new RegExp(escape_string_regexp_1.default(word), "i");
                        if (regex.test(link.input)) {
                            continue typeLoop;
                        }
                    }
                }
                if (trigger.include_words) {
                    for (const word of trigger.include_words) {
                        const regex = new RegExp(escape_string_regexp_1.default(word), "i");
                        if (regex.test(link.input)) {
                            return { extra: { type, link: link.input } };
                        }
                    }
                }
                if (trigger.exclude_domains) {
                    for (const domain of trigger.exclude_domains) {
                        const normalizedDomain = domain.toLowerCase();
                        if (normalizedDomain === normalizedHostname) {
                            continue typeLoop;
                        }
                        if (trigger.include_subdomains && normalizedHostname.endsWith(`.${domain}`)) {
                            continue typeLoop;
                        }
                    }
                    return { extra: { type, link: link.toString() } };
                }
                if (trigger.include_domains) {
                    for (const domain of trigger.include_domains) {
                        const normalizedDomain = domain.toLowerCase();
                        if (normalizedDomain === normalizedHostname) {
                            return { extra: { type, link: domain } };
                        }
                        if (trigger.include_subdomains && normalizedHostname.endsWith(`.${domain}`)) {
                            return { extra: { type, link: domain } };
                        }
                    }
                }
            }
        }
        return null;
    },
    renderMatchInformation({ pluginData, contexts, matchResult }) {
        const partialSummary = getTextMatchPartialSummary_1.getTextMatchPartialSummary(pluginData, matchResult.extra.type, contexts[0]);
        return `Matched link \`${utils_1.disableInlineCode(matchResult.extra.link)}\` in ${partialSummary}`;
    },
});
