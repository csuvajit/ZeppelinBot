"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreate = void 0;
const utils_1 = require("../../../utils");
const applyBotSlowmodeToUserId_1 = require("./applyBotSlowmodeToUserId");
const pluginUtils_1 = require("../../../pluginUtils");
const getMissingChannelPermissions_1 = require("../../../utils/getMissingChannelPermissions");
const requiredPermissions_1 = require("../requiredPermissions");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
async function onMessageCreate(pluginData, msg) {
    if (msg.is_bot)
        return;
    const channel = pluginData.guild.channels.get(msg.channel_id);
    if (!channel)
        return;
    // Don't apply slowmode if the lock was interrupted earlier (e.g. the message was caught by word filters)
    const thisMsgLock = await pluginData.locks.acquire(lockNameHelpers_1.messageLock(msg));
    if (thisMsgLock.interrupted)
        return;
    // Check if this channel even *has* a bot-maintained slowmode
    const channelSlowmode = await pluginData.state.slowmodes.getChannelSlowmode(channel.id);
    if (!channelSlowmode)
        return thisMsgLock.unlock();
    // Make sure this user is affected by the slowmode
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, msg.user_id);
    const isAffected = await pluginUtils_1.hasPermission(pluginData, "is_affected", {
        channelId: channel.id,
        userId: msg.user_id,
        member,
    });
    if (!isAffected)
        return thisMsgLock.unlock();
    // Make sure we have the appropriate permissions to manage this slowmode
    const me = pluginData.guild.members.get(pluginData.client.user.id);
    const missingPermissions = getMissingChannelPermissions_1.getMissingChannelPermissions(me, channel, requiredPermissions_1.BOT_SLOWMODE_PERMISSIONS);
    if (missingPermissions) {
        const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
        logs.log(LogType_1.LogType.BOT_ALERT, {
            body: `Unable to manage bot slowmode in <#${channel.id}>. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`,
        });
        return;
    }
    // Delete any extra messages sent after a slowmode was already applied
    const userHasSlowmode = await pluginData.state.slowmodes.userHasSlowmode(channel.id, msg.user_id);
    if (userHasSlowmode) {
        const message = await channel.getMessage(msg.id);
        if (message) {
            message.delete();
            return thisMsgLock.interrupt();
        }
        return thisMsgLock.unlock();
    }
    await applyBotSlowmodeToUserId_1.applyBotSlowmodeToUserId(pluginData, channel, msg.user_id);
    thisMsgLock.unlock();
}
exports.onMessageCreate = onMessageCreate;
