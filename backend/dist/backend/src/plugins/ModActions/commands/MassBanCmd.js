"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassbanCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const CaseTypes_1 = require("../../../data/CaseTypes");
const helpers_1 = require("knub/dist/helpers");
const ignoreEvent_1 = require("../functions/ignoreEvent");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const LogType_1 = require("../../../data/LogType");
const perf_hooks_1 = require("perf_hooks");
const humanizeDurationShort_1 = require("../../../humanizeDurationShort");
exports.MassbanCmd = types_1.modActionsCmd({
    trigger: "massban",
    permission: "can_massban",
    description: "Mass-ban a list of user IDs",
    signature: [
        {
            userIds: commandTypes_1.commandTypeHelpers.string({ rest: true }),
        },
    ],
    async run({ pluginData, message: msg, args }) {
        // Limit to 100 users at once (arbitrary?)
        if (args.userIds.length > 100) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Can only massban max 100 users at once`);
            return;
        }
        // Ask for ban reason (cleaner this way instead of trying to cram it into the args)
        msg.channel.createMessage("Ban reason? `cancel` to cancel");
        const banReasonReply = await helpers_1.waitForReply(pluginData.client, msg.channel, msg.author.id);
        if (!banReasonReply || !banReasonReply.content || banReasonReply.content.toLowerCase().trim() === "cancel") {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cancelled");
            return;
        }
        const banReason = formatReasonWithAttachments_1.formatReasonWithAttachments(banReasonReply.content, msg.attachments);
        // Verify we can act on each of the users specified
        for (const userId of args.userIds) {
            const member = pluginData.guild.members.get(userId); // TODO: Get members on demand?
            if (member && !pluginUtils_1.canActOn(pluginData, msg.member, member)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot massban one or more users: insufficient permissions");
                return;
            }
        }
        // Show a loading indicator since this can take a while
        const maxWaitTime = pluginData.state.massbanQueue.timeout * pluginData.state.massbanQueue.length;
        const maxWaitTimeFormatted = humanizeDurationShort_1.humanizeDurationShort(maxWaitTime, { round: true });
        const initialLoadingText = pluginData.state.massbanQueue.length === 0
            ? "Banning..."
            : `Massban queued. Waiting for previous massban to finish (max wait ${maxWaitTimeFormatted}).`;
        const loadingMsg = await msg.channel.createMessage(initialLoadingText);
        const waitTimeStart = perf_hooks_1.performance.now();
        const waitingInterval = setInterval(() => {
            const waitTime = humanizeDurationShort_1.humanizeDurationShort(perf_hooks_1.performance.now() - waitTimeStart, { round: true });
            loadingMsg
                .edit(`Massban queued. Still waiting for previous massban to finish (waited ${waitTime}).`)
                .catch(() => clearInterval(waitingInterval));
        }, 1 * utils_1.MINUTES);
        pluginData.state.massbanQueue.add(async () => {
            clearInterval(waitingInterval);
            if (pluginData.state.unloaded) {
                void loadingMsg.delete().catch(utils_1.noop);
                return;
            }
            void loadingMsg.edit("Banning...").catch(utils_1.noop);
            // Ban each user and count failed bans (if any)
            const startTime = perf_hooks_1.performance.now();
            const failedBans = [];
            const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
            for (const [i, userId] of args.userIds.entries()) {
                if (pluginData.state.unloaded) {
                    break;
                }
                try {
                    // Ignore automatic ban cases and logs
                    // We create our own cases below and post a single "mass banned" log instead
                    ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Ban, userId, 120 * 1000);
                    pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_BAN, userId, 120 * 1000);
                    await pluginData.guild.banMember(userId, 1, banReason != null ? encodeURIComponent(banReason) : undefined);
                    await casesPlugin.createCase({
                        userId,
                        modId: msg.author.id,
                        type: CaseTypes_1.CaseTypes.Ban,
                        reason: `Mass ban: ${banReason}`,
                        postInCaseLogOverride: false,
                    });
                    pluginData.state.events.emit("ban", userId, banReason);
                }
                catch {
                    failedBans.push(userId);
                }
                // Send a status update every 10 bans
                if ((i + 1) % 10 === 0) {
                    loadingMsg.edit(`Banning... ${i + 1}/${args.userIds.length}`).catch(utils_1.noop);
                }
            }
            const totalTime = perf_hooks_1.performance.now() - startTime;
            const formattedTimeTaken = humanizeDurationShort_1.humanizeDurationShort(totalTime, { round: true });
            // Clear loading indicator
            loadingMsg.delete().catch(utils_1.noop);
            const successfulBanCount = args.userIds.length - failedBans.length;
            if (successfulBanCount === 0) {
                // All bans failed - don't create a log entry and notify the user
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "All bans failed. Make sure the IDs are valid.");
            }
            else {
                // Some or all bans were successful. Create a log entry for the mass ban and notify the user.
                pluginData.state.serverLogs.log(LogType_1.LogType.MASSBAN, {
                    mod: utils_1.stripObjectToScalars(msg.author),
                    count: successfulBanCount,
                    reason: banReason,
                });
                if (failedBans.length) {
                    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Banned ${successfulBanCount} users in ${formattedTimeTaken}, ${failedBans.length} failed: ${failedBans.join(" ")}`);
                }
                else {
                    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Banned ${successfulBanCount} users successfully in ${formattedTimeTaken}`);
                }
            }
        });
    },
});
