"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassmuteCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const helpers_1 = require("knub/dist/helpers");
const LogType_1 = require("../../../data/LogType");
const logger_1 = require("../../../logger");
const MutesPlugin_1 = require("../../../plugins/Mutes/MutesPlugin");
exports.MassmuteCmd = types_1.modActionsCmd({
    trigger: "massmute",
    permission: "can_massmute",
    description: "Mass-mute a list of user IDs",
    signature: [
        {
            userIds: commandTypes_1.commandTypeHelpers.string({ rest: true }),
        },
    ],
    async run({ pluginData, message: msg, args }) {
        // Limit to 100 users at once (arbitrary?)
        if (args.userIds.length > 100) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Can only massmute max 100 users at once`);
            return;
        }
        // Ask for mute reason
        msg.channel.createMessage("Mute reason? `cancel` to cancel");
        const muteReasonReceived = await helpers_1.waitForReply(pluginData.client, msg.channel, msg.author.id);
        if (!muteReasonReceived ||
            !muteReasonReceived.content ||
            muteReasonReceived.content.toLowerCase().trim() === "cancel") {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cancelled");
            return;
        }
        const muteReason = formatReasonWithAttachments_1.formatReasonWithAttachments(muteReasonReceived.content, msg.attachments);
        // Verify we can act upon all users
        for (const userId of args.userIds) {
            const member = pluginData.guild.members.get(userId);
            if (member && !pluginUtils_1.canActOn(pluginData, msg.member, member)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot massmute one or more users: insufficient permissions");
                return;
            }
        }
        // Ignore automatic mute cases and logs for these users
        // We'll create our own cases below and post a single "mass muted" log instead
        args.userIds.forEach(userId => {
            // Use longer timeouts since this can take a while
            pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_MUTE, userId, 120 * 1000);
        });
        // Show loading indicator
        const loadingMsg = await msg.channel.createMessage("Muting...");
        // Mute everyone and count fails
        const modId = msg.author.id;
        const failedMutes = [];
        const mutesPlugin = pluginData.getPlugin(MutesPlugin_1.MutesPlugin);
        for (const userId of args.userIds) {
            try {
                await mutesPlugin.muteUser(userId, 0, `Mass mute: ${muteReason}`, {
                    caseArgs: {
                        modId,
                    },
                });
            }
            catch (e) {
                logger_1.logger.info(e);
                failedMutes.push(userId);
            }
        }
        // Clear loading indicator
        loadingMsg.delete();
        const successfulMuteCount = args.userIds.length - failedMutes.length;
        if (successfulMuteCount === 0) {
            // All mutes failed
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "All mutes failed. Make sure the IDs are valid.");
        }
        else {
            // Success on all or some mutes
            pluginData.state.serverLogs.log(LogType_1.LogType.MASSMUTE, {
                mod: utils_1.stripObjectToScalars(msg.author),
                count: successfulMuteCount,
            });
            if (failedMutes.length) {
                pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Muted ${successfulMuteCount} users, ${failedMutes.length} failed: ${failedMutes.join(" ")}`);
            }
            else {
                pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Muted ${successfulMuteCount} users successfully`);
            }
        }
    },
});
