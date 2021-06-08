"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassunbanCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const isBanned_1 = require("../functions/isBanned");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const CaseTypes_1 = require("../../../data/CaseTypes");
const helpers_1 = require("knub/dist/helpers");
const ignoreEvent_1 = require("../functions/ignoreEvent");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const LogType_1 = require("../../../data/LogType");
exports.MassunbanCmd = types_1.modActionsCmd({
    trigger: "massunban",
    permission: "can_massunban",
    description: "Mass-unban a list of user IDs",
    signature: [
        {
            userIds: commandTypes_1.commandTypeHelpers.string({ rest: true }),
        },
    ],
    async run({ pluginData, message: msg, args }) {
        // Limit to 100 users at once (arbitrary?)
        if (args.userIds.length > 100) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Can only mass-unban max 100 users at once`);
            return;
        }
        // Ask for unban reason (cleaner this way instead of trying to cram it into the args)
        msg.channel.createMessage("Unban reason? `cancel` to cancel");
        const unbanReasonReply = await helpers_1.waitForReply(pluginData.client, msg.channel, msg.author.id);
        if (!unbanReasonReply || !unbanReasonReply.content || unbanReasonReply.content.toLowerCase().trim() === "cancel") {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cancelled");
            return;
        }
        const unbanReason = formatReasonWithAttachments_1.formatReasonWithAttachments(unbanReasonReply.content, msg.attachments);
        // Ignore automatic unban cases and logs for these users
        // We'll create our own cases below and post a single "mass unbanned" log instead
        args.userIds.forEach(userId => {
            // Use longer timeouts since this can take a while
            ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Unban, userId, 120 * 1000);
            pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_UNBAN, userId, 120 * 1000);
        });
        // Show a loading indicator since this can take a while
        const loadingMsg = await msg.channel.createMessage("Unbanning...");
        // Unban each user and count failed unbans (if any)
        const failedUnbans = [];
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        for (const userId of args.userIds) {
            if (!(await isBanned_1.isBanned(pluginData, userId))) {
                failedUnbans.push({ userId, reason: UnbanFailReasons.NOT_BANNED });
                continue;
            }
            try {
                await pluginData.guild.unbanMember(userId, unbanReason != null ? encodeURIComponent(unbanReason) : undefined);
                await casesPlugin.createCase({
                    userId,
                    modId: msg.author.id,
                    type: CaseTypes_1.CaseTypes.Unban,
                    reason: `Mass unban: ${unbanReason}`,
                    postInCaseLogOverride: false,
                });
            }
            catch {
                failedUnbans.push({ userId, reason: UnbanFailReasons.UNBAN_FAILED });
            }
        }
        // Clear loading indicator
        loadingMsg.delete();
        const successfulUnbanCount = args.userIds.length - failedUnbans.length;
        if (successfulUnbanCount === 0) {
            // All unbans failed - don't create a log entry and notify the user
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "All unbans failed. Make sure the IDs are valid and banned.");
        }
        else {
            // Some or all unbans were successful. Create a log entry for the mass unban and notify the user.
            pluginData.state.serverLogs.log(LogType_1.LogType.MASSUNBAN, {
                mod: utils_1.stripObjectToScalars(msg.author),
                count: successfulUnbanCount,
                reason: unbanReason,
            });
            if (failedUnbans.length) {
                const notBanned = failedUnbans.filter(x => x.reason === UnbanFailReasons.NOT_BANNED);
                const unbanFailed = failedUnbans.filter(x => x.reason === UnbanFailReasons.UNBAN_FAILED);
                let failedMsg = "";
                if (notBanned.length > 0) {
                    failedMsg += `${notBanned.length}x ${UnbanFailReasons.NOT_BANNED}:`;
                    notBanned.forEach(fail => {
                        failedMsg += " " + fail.userId;
                    });
                }
                if (unbanFailed.length > 0) {
                    failedMsg += `\n${unbanFailed.length}x ${UnbanFailReasons.UNBAN_FAILED}:`;
                    unbanFailed.forEach(fail => {
                        failedMsg += " " + fail.userId;
                    });
                }
                pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Unbanned ${successfulUnbanCount} users, ${failedUnbans.length} failed:\n${failedMsg}`);
            }
            else {
                pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Unbanned ${successfulUnbanCount} users successfully`);
            }
        }
    },
});
var UnbanFailReasons;
(function (UnbanFailReasons) {
    UnbanFailReasons["NOT_BANNED"] = "Not banned";
    UnbanFailReasons["UNBAN_FAILED"] = "Unban failed";
})(UnbanFailReasons || (UnbanFailReasons = {}));
