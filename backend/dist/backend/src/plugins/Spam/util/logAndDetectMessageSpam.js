"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAndDetectMessageSpam = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const CaseTypes_1 = require("../../../data/CaseTypes");
const logger_1 = require("../../../logger");
const MutesPlugin_1 = require("../../../plugins/Mutes/MutesPlugin");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const addRecentAction_1 = require("./addRecentAction");
const getRecentActionCount_1 = require("./getRecentActionCount");
const getRecentActions_1 = require("./getRecentActions");
const clearRecentUserActions_1 = require("./clearRecentUserActions");
const saveSpamArchives_1 = require("./saveSpamArchives");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const RecoverablePluginError_1 = require("../../../RecoverablePluginError");
async function logAndDetectMessageSpam(pluginData, savedMessage, type, spamConfig, actionCount, description) {
    if (actionCount === 0)
        return;
    // Make sure we're not handling some messages twice
    if (pluginData.state.lastHandledMsgIds.has(savedMessage.user_id)) {
        const channelMap = pluginData.state.lastHandledMsgIds.get(savedMessage.user_id);
        if (channelMap.has(savedMessage.channel_id)) {
            const lastHandledMsgId = channelMap.get(savedMessage.channel_id);
            if (lastHandledMsgId >= savedMessage.id)
                return;
        }
    }
    pluginData.state.spamDetectionQueue = pluginData.state.spamDetectionQueue.then(async () => {
        const timestamp = moment_timezone_1.default.utc(savedMessage.posted_at, utils_1.DBDateFormat).valueOf();
        const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, savedMessage.user_id);
        const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
        // Log this action...
        addRecentAction_1.addRecentAction(pluginData, type, savedMessage.user_id, savedMessage.channel_id, savedMessage, timestamp, actionCount);
        // ...and then check if it trips the spam filters
        const since = timestamp - 1000 * spamConfig.interval;
        const recentActionsCount = getRecentActionCount_1.getRecentActionCount(pluginData, type, savedMessage.user_id, savedMessage.channel_id, since);
        // If the user tripped the spam filter...
        if (recentActionsCount > spamConfig.count) {
            const recentActions = getRecentActions_1.getRecentActions(pluginData, type, savedMessage.user_id, savedMessage.channel_id, since);
            // Start by muting them, if enabled
            let muteResult = null;
            if (spamConfig.mute && member) {
                const mutesPlugin = pluginData.getPlugin(MutesPlugin_1.MutesPlugin);
                const muteTime = (spamConfig.mute_time && utils_1.convertDelayStringToMS(spamConfig.mute_time.toString())) ?? 120 * 1000;
                try {
                    muteResult = await mutesPlugin.muteUser(member.id, muteTime, "Automatic spam detection", {
                        caseArgs: {
                            modId: pluginData.client.user.id,
                            postInCaseLogOverride: false,
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
            // Get the offending message IDs
            // We also get the IDs of any messages after the last offending message, to account for lag before detection
            const savedMessages = recentActions.map(a => a.extraData);
            const msgIds = savedMessages.map(m => m.id);
            const lastDetectedMsgId = msgIds[msgIds.length - 1];
            const additionalMessages = await pluginData.state.savedMessages.getUserMessagesByChannelAfterId(savedMessage.user_id, savedMessage.channel_id, lastDetectedMsgId);
            additionalMessages.forEach(m => msgIds.push(m.id));
            // Then, if enabled, remove the spam messages
            if (spamConfig.clean !== false) {
                msgIds.forEach(id => pluginData.state.logs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE, id));
                pluginData.client.deleteMessages(savedMessage.channel_id, msgIds).catch(utils_1.noop);
            }
            // Store the ID of the last handled message
            const uniqueMessages = Array.from(new Set([...savedMessages, ...additionalMessages]));
            uniqueMessages.sort((a, b) => (a.id > b.id ? 1 : -1));
            const lastHandledMsgId = uniqueMessages
                .map(m => m.id)
                .reduce((last, id) => {
                return id > last ? id : last;
            });
            if (!pluginData.state.lastHandledMsgIds.has(savedMessage.user_id)) {
                pluginData.state.lastHandledMsgIds.set(savedMessage.user_id, new Map());
            }
            const channelMap = pluginData.state.lastHandledMsgIds.get(savedMessage.user_id);
            channelMap.set(savedMessage.channel_id, lastHandledMsgId);
            // Clear the handled actions from recentActions
            clearRecentUserActions_1.clearRecentUserActions(pluginData, type, savedMessage.user_id, savedMessage.channel_id);
            // Generate a log from the detected messages
            const channel = pluginData.guild.channels.get(savedMessage.channel_id);
            const archiveUrl = await saveSpamArchives_1.saveSpamArchives(pluginData, uniqueMessages);
            // Create a case
            const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
            if (muteResult) {
                // If the user was muted, the mute already generated a case - in that case, just update the case with extra details
                // This will also post the case in the case log channel, which we didn't do with the mute initially to avoid
                // posting the case on the channel twice: once with the initial reason, and then again with the note from here
                const updateText = utils_1.trimLines(`
              Details: ${description} (over ${spamConfig.count} in ${spamConfig.interval}s)
              ${archiveUrl}
            `);
                casesPlugin.createCaseNote({
                    caseId: muteResult.case.id,
                    modId: muteResult.case.mod_id || "0",
                    body: updateText,
                    automatic: true,
                });
            }
            else {
                // If the user was not muted, create a note case of the detected spam instead
                const caseText = utils_1.trimLines(`
              Automatic spam detection: ${description} (over ${spamConfig.count} in ${spamConfig.interval}s)
              ${archiveUrl}
            `);
                casesPlugin.createCase({
                    userId: savedMessage.user_id,
                    modId: pluginData.client.user.id,
                    type: CaseTypes_1.CaseTypes.Note,
                    reason: caseText,
                    automatic: true,
                });
            }
            // Create a log entry
            logs.log(LogType_1.LogType.MESSAGE_SPAM_DETECTED, {
                member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
                channel: utils_1.stripObjectToScalars(channel),
                description,
                limit: spamConfig.count,
                interval: spamConfig.interval,
                archiveUrl,
            });
        }
    }, err => {
        logger_1.logger.error(`Error while detecting spam:\n${err}`);
    });
}
exports.logAndDetectMessageSpam = logAndDetectMessageSpam;
