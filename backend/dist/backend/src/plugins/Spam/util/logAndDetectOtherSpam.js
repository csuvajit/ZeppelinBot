"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAndDetectOtherSpam = void 0;
const types_1 = require("../types");
const addRecentAction_1 = require("./addRecentAction");
const getRecentActionCount_1 = require("./getRecentActionCount");
const utils_1 = require("../../../utils");
const MutesPlugin_1 = require("../../../plugins/Mutes/MutesPlugin");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const clearRecentUserActions_1 = require("./clearRecentUserActions");
const LogType_1 = require("../../../data/LogType");
const RecoverablePluginError_1 = require("../../../RecoverablePluginError");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
async function logAndDetectOtherSpam(pluginData, type, spamConfig, userId, actionCount, actionGroupId, timestamp, extraData = null, description) {
    pluginData.state.spamDetectionQueue = pluginData.state.spamDetectionQueue.then(async () => {
        // Log this action...
        addRecentAction_1.addRecentAction(pluginData, type, userId, actionGroupId, extraData, timestamp, actionCount);
        // ...and then check if it trips the spam filters
        const since = timestamp - 1000 * spamConfig.interval;
        const recentActionsCount = getRecentActionCount_1.getRecentActionCount(pluginData, type, userId, actionGroupId, since);
        if (recentActionsCount > spamConfig.count) {
            const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, userId);
            const details = `${description} (over ${spamConfig.count} in ${spamConfig.interval}s)`;
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            if (spamConfig.mute && member) {
                const mutesPlugin = pluginData.getPlugin(MutesPlugin_1.MutesPlugin);
                const muteTime = (spamConfig.mute_time && utils_1.convertDelayStringToMS(spamConfig.mute_time.toString())) ?? 120 * 1000;
                try {
                    await mutesPlugin.muteUser(member.id, muteTime, "Automatic spam detection", {
                        caseArgs: {
                            modId: pluginData.client.user.id,
                            extraNotes: [`Details: ${details}`],
                        },
                    }, spamConfig.remove_roles_on_mute, spamConfig.restore_roles_on_mute);
                }
                catch (e) {
                    if (e instanceof RecoverablePluginError_1.RecoverablePluginError && e.code === RecoverablePluginError_1.ERRORS.NO_MUTE_ROLE_IN_CONFIG) {
                        logs.log(LogType_1.LogType.BOT_ALERT, {
                            body: `Failed to mute <@!${member.id}> in \`spam\` plugin because a mute role has not been specified in server config`,
                        });
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                // If we're not muting the user, just add a note on them
                const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
                await casesPlugin.createCase({
                    userId,
                    modId: pluginData.client.user.id,
                    type: CaseTypes_1.CaseTypes.Note,
                    reason: `Automatic spam detection: ${details}`,
                });
            }
            // Clear recent cases
            clearRecentUserActions_1.clearRecentUserActions(pluginData, types_1.RecentActionType.VoiceChannelMove, userId, actionGroupId);
            logs.log(LogType_1.LogType.OTHER_SPAM_DETECTED, {
                member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
                description,
                limit: spamConfig.count,
                interval: spamConfig.interval,
            });
        }
    });
}
exports.logAndDetectOtherSpam = logAndDetectOtherSpam;
