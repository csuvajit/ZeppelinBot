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
exports.WarnAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const resolveActionContactMethods_1 = require("../functions/resolveActionContactMethods");
const ModActionsPlugin_1 = require("../../ModActions/ModActionsPlugin");
exports.WarnAction = helpers_1.automodAction({
    configType: t.type({
        reason: utils_1.tNullable(t.string),
        notify: utils_1.tNullable(t.string),
        notifyChannel: utils_1.tNullable(t.string),
        postInCaseLog: utils_1.tNullable(t.boolean),
        hide_case: utils_1.tNullable(t.boolean),
    }),
    defaultConfig: {
        notify: null,
        hide_case: false,
    },
    async apply({ pluginData, contexts, actionConfig, matchResult }) {
        const reason = actionConfig.reason || "Warned automatically";
        const contactMethods = actionConfig.notify ? resolveActionContactMethods_1.resolveActionContactMethods(pluginData, actionConfig) : undefined;
        const caseArgs = {
            modId: pluginData.client.user.id,
            extraNotes: matchResult.fullSummary ? [matchResult.fullSummary] : [],
            automatic: true,
            postInCaseLogOverride: actionConfig.postInCaseLog ?? undefined,
            hide: Boolean(actionConfig.hide_case),
        };
        const userIdsToWarn = utils_1.unique(contexts.map(c => c.user?.id).filter(utils_1.nonNullish));
        const membersToWarn = await utils_1.asyncMap(userIdsToWarn, id => utils_1.resolveMember(pluginData.client, pluginData.guild, id));
        const modActions = pluginData.getPlugin(ModActionsPlugin_1.ModActionsPlugin);
        for (const member of membersToWarn) {
            if (!member)
                continue;
            await modActions.warnMember(member, reason, { contactMethods, caseArgs, isAutomodAction: true });
        }
    },
});
