"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualKickMemberCmd = void 0;
const LogType_1 = require("../../../data/LogType");
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const helpers_1 = require("knub/dist/helpers");
const readContactMethodsFromArgs_1 = require("./readContactMethodsFromArgs");
const formatReasonWithAttachments_1 = require("./formatReasonWithAttachments");
const kickMember_1 = require("./kickMember");
const ignoreEvent_1 = require("./ignoreEvent");
const isBanned_1 = require("./isBanned");
async function actualKickMemberCmd(pluginData, msg, args) {
    const user = await utils_1.resolveUser(pluginData.client, args.user);
    if (!user.id) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found`);
        return;
    }
    const memberToKick = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
    if (!memberToKick) {
        const banned = await isBanned_1.isBanned(pluginData, user.id);
        if (banned) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User is banned`);
        }
        else {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found on the server`);
        }
        return;
    }
    // Make sure we're allowed to kick this member
    if (!pluginUtils_1.canActOn(pluginData, msg.member, memberToKick)) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot kick: insufficient permissions");
        return;
    }
    // The moderator who did the action is the message author or, if used, the specified -mod
    let mod = msg.member;
    if (args.mod) {
        if (!(await helpers_1.hasPermission(await pluginData.config.getForMessage(msg), "can_act_as_other"))) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You don't have permission to use -mod");
            return;
        }
        mod = args.mod;
    }
    let contactMethods;
    try {
        contactMethods = readContactMethodsFromArgs_1.readContactMethodsFromArgs(args);
    }
    catch (e) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
        return;
    }
    const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments);
    const kickResult = await kickMember_1.kickMember(pluginData, memberToKick, reason, {
        contactMethods,
        caseArgs: {
            modId: mod.id,
            ppId: mod.id !== msg.author.id ? msg.author.id : null,
        },
    });
    if (args.clean) {
        pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_BAN, memberToKick.id);
        ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Ban, memberToKick.id);
        try {
            await memberToKick.ban(1, encodeURIComponent("kick -clean"));
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Failed to ban the user to clean messages (-clean)");
        }
        pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_UNBAN, memberToKick.id);
        ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Unban, memberToKick.id);
        try {
            await pluginData.guild.unbanMember(memberToKick.id, encodeURIComponent("kick -clean"));
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Failed to unban the user after banning them (-clean)");
        }
    }
    if (kickResult.status === "failed") {
        msg.channel.createMessage(utils_1.errorMessage(`Failed to kick user`));
        return;
    }
    // Confirm the action to the moderator
    let response = `Kicked **${memberToKick.user.username}#${memberToKick.user.discriminator}** (Case #${kickResult.case.case_number})`;
    if (kickResult.notifyResult.text)
        response += ` (${kickResult.notifyResult.text})`;
    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, response);
}
exports.actualKickMemberCmd = actualKickMemberCmd;
