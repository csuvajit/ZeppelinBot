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
exports.createMessageSpamTrigger = void 0;
const helpers_1 = require("../helpers");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const humanizeDurationShort_1 = require("../../../humanizeDurationShort");
const findRecentSpam_1 = require("./findRecentSpam");
const getMatchingMessageRecentActions_1 = require("./getMatchingMessageRecentActions");
const t = __importStar(require("io-ts"));
const getSpamIdentifier_1 = require("./getSpamIdentifier");
const MessageSpamTriggerConfig = t.type({
    amount: t.number,
    within: utils_1.tDelayString,
    per_channel: utils_1.tNullable(t.boolean),
});
function createMessageSpamTrigger(spamType, prettyName) {
    return helpers_1.automodTrigger()({
        configType: MessageSpamTriggerConfig,
        defaultConfig: {},
        async match({ pluginData, context, triggerConfig }) {
            if (!context.message) {
                return;
            }
            const spamIdentifier = getSpamIdentifier_1.getMessageSpamIdentifier(context.message, Boolean(triggerConfig.per_channel));
            const recentSpam = findRecentSpam_1.findRecentSpam(pluginData, spamType, spamIdentifier);
            if (recentSpam) {
                if (recentSpam.archiveId) {
                    await pluginData.state.archives.addSavedMessagesToArchive(recentSpam.archiveId, [context.message], pluginData.guild);
                }
                return {
                    silentClean: true,
                    extra: { archiveId: "" },
                };
            }
            const within = utils_1.convertDelayStringToMS(triggerConfig.within) ?? 0;
            const matchedSpam = getMatchingMessageRecentActions_1.getMatchingMessageRecentActions(pluginData, context.message, spamType, spamIdentifier, triggerConfig.amount, within);
            if (matchedSpam) {
                const messages = matchedSpam.recentActions
                    .map(action => action.context.message)
                    .filter(Boolean)
                    .sort(utils_1.sorter("posted_at"));
                const archiveId = await pluginData.state.archives.createFromSavedMessages(messages, pluginData.guild);
                pluginData.state.recentSpam.push({
                    type: spamType,
                    identifiers: [spamIdentifier],
                    archiveId,
                    timestamp: Date.now(),
                });
                return {
                    extraContexts: matchedSpam.recentActions
                        .map(action => action.context)
                        .filter(_context => _context !== context),
                    extra: {
                        archiveId,
                    },
                };
            }
        },
        renderMatchInformation({ pluginData, matchResult, triggerConfig }) {
            const baseUrl = pluginUtils_1.getBaseUrl(pluginData);
            const archiveUrl = pluginData.state.archives.getUrl(baseUrl, matchResult.extra.archiveId);
            const withinMs = utils_1.convertDelayStringToMS(triggerConfig.within);
            const withinStr = humanizeDurationShort_1.humanizeDurationShort(withinMs);
            return `Matched ${prettyName} spam (${triggerConfig.amount} in ${withinStr}): ${archiveUrl}`;
        },
    });
}
exports.createMessageSpamTrigger = createMessageSpamTrigger;
