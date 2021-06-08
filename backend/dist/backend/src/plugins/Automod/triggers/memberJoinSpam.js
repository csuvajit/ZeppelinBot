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
exports.MemberJoinSpamTrigger = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const getMatchingRecentActions_1 = require("../functions/getMatchingRecentActions");
const constants_1 = require("../constants");
const sumRecentActionCounts_1 = require("../functions/sumRecentActionCounts");
const findRecentSpam_1 = require("../functions/findRecentSpam");
exports.MemberJoinSpamTrigger = helpers_1.automodTrigger()({
    configType: t.type({
        amount: t.number,
        within: utils_1.tDelayString,
    }),
    defaultConfig: {},
    async match({ pluginData, context, triggerConfig }) {
        if (!context.joined || !context.member) {
            return;
        }
        const recentSpam = findRecentSpam_1.findRecentSpam(pluginData, constants_1.RecentActionType.MemberJoin);
        if (recentSpam) {
            context.actioned = true;
            return {};
        }
        const since = Date.now() - utils_1.convertDelayStringToMS(triggerConfig.within);
        const matchingActions = getMatchingRecentActions_1.getMatchingRecentActions(pluginData, constants_1.RecentActionType.MemberJoin, null, since);
        const totalCount = sumRecentActionCounts_1.sumRecentActionCounts(matchingActions);
        if (totalCount >= triggerConfig.amount) {
            const extraContexts = matchingActions.map(a => a.context).filter(c => c !== context);
            pluginData.state.recentSpam.push({
                type: constants_1.RecentActionType.MemberJoin,
                timestamp: Date.now(),
                archiveId: null,
                identifiers: [],
            });
            return {
                extraContexts,
            };
        }
    },
    renderMatchInformation({ pluginData, contexts, triggerConfig }) {
        return "";
    },
});
