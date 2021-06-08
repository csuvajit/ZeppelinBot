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
exports.MuteAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const resolveActionContactMethods_1 = require("../functions/resolveActionContactMethods");
const MutesPlugin_1 = require("../../Mutes/MutesPlugin");
const RecoverablePluginError_1 = require("../../../RecoverablePluginError");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
exports.MuteAction = helpers_1.automodAction({
    configType: t.type({
        reason: utils_1.tNullable(t.string),
        duration: utils_1.tNullable(utils_1.tDelayString),
        notify: utils_1.tNullable(t.string),
        notifyChannel: utils_1.tNullable(t.string),
        remove_roles_on_mute: utils_1.tNullable(t.union([t.boolean, t.array(t.string)])),
        restore_roles_on_mute: utils_1.tNullable(t.union([t.boolean, t.array(t.string)])),
        postInCaseLog: utils_1.tNullable(t.boolean),
        hide_case: utils_1.tNullable(t.boolean),
    }),
    defaultConfig: {
        notify: null,
        hide_case: false,
    },
    async apply({ pluginData, contexts, actionConfig, ruleName, matchResult }) {
        const duration = actionConfig.duration ? utils_1.convertDelayStringToMS(actionConfig.duration) : undefined;
        const reason = actionConfig.reason || "Muted automatically";
        const contactMethods = actionConfig.notify ? resolveActionContactMethods_1.resolveActionContactMethods(pluginData, actionConfig) : undefined;
        const rolesToRemove = actionConfig.remove_roles_on_mute;
        const rolesToRestore = actionConfig.restore_roles_on_mute;
        const caseArgs = {
            modId: pluginData.client.user.id,
            extraNotes: matchResult.fullSummary ? [matchResult.fullSummary] : [],
            automatic: true,
            postInCaseLogOverride: actionConfig.postInCaseLog ?? undefined,
            hide: Boolean(actionConfig.hide_case),
        };
        const userIdsToMute = utils_1.unique(contexts.map(c => c.user?.id).filter(utils_1.nonNullish));
        const mutes = pluginData.getPlugin(MutesPlugin_1.MutesPlugin);
        for (const userId of userIdsToMute) {
            try {
                await mutes.muteUser(userId, duration, reason, { contactMethods, caseArgs, isAutomodAction: true }, rolesToRemove, rolesToRestore);
            }
            catch (e) {
                if (e instanceof RecoverablePluginError_1.RecoverablePluginError && e.code === RecoverablePluginError_1.ERRORS.NO_MUTE_ROLE_IN_CONFIG) {
                    pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.BOT_ALERT, {
                        body: `Failed to mute <@!${userId}> in Automod rule \`${ruleName}\` because a mute role has not been specified in server config`,
                    });
                }
                else {
                    throw e;
                }
            }
        }
    },
});
