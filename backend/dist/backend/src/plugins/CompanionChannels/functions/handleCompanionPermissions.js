"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCompanionPermissions = void 0;
const getCompanionChannelOptsForVoiceChannelId_1 = require("./getCompanionChannelOptsForVoiceChannelId");
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const ERROR_COOLDOWN_KEY = "errorCooldown";
const ERROR_COOLDOWN = 5 * utils_1.MINUTES;
async function handleCompanionPermissions(pluginData, userId, voiceChannel, oldChannel) {
    if (pluginData.state.errorCooldownManager.isOnCooldown(ERROR_COOLDOWN_KEY)) {
        return;
    }
    const permsToDelete = new Set(); // channelId[]
    const oldPerms = new Map(); // channelId => permissions
    const permsToSet = new Map(); // channelId => permissions
    const oldChannelOptsArr = oldChannel
        ? await getCompanionChannelOptsForVoiceChannelId_1.getCompanionChannelOptsForVoiceChannelId(pluginData, userId, oldChannel)
        : [];
    const newChannelOptsArr = voiceChannel
        ? await getCompanionChannelOptsForVoiceChannelId_1.getCompanionChannelOptsForVoiceChannelId(pluginData, userId, voiceChannel)
        : [];
    for (const oldChannelOpts of oldChannelOptsArr) {
        for (const channelId of oldChannelOpts.text_channel_ids) {
            oldPerms.set(channelId, oldChannelOpts.permissions);
            permsToDelete.add(channelId);
        }
    }
    for (const newChannelOpts of newChannelOptsArr) {
        for (const channelId of newChannelOpts.text_channel_ids) {
            if (oldPerms.get(channelId) !== newChannelOpts.permissions) {
                // Update text channel perms if the channel we transitioned from didn't already have the same text channel perms
                permsToSet.set(channelId, newChannelOpts.permissions);
            }
            if (permsToDelete.has(channelId)) {
                permsToDelete.delete(channelId);
            }
        }
    }
    try {
        for (const channelId of permsToDelete) {
            const channel = pluginData.guild.channels.get(channelId);
            if (!channel || !(channel instanceof eris_1.TextChannel))
                continue;
            await channel.deletePermission(userId, `Companion Channel for ${oldChannel.id} | User Left`);
        }
        for (const [channelId, permissions] of permsToSet) {
            const channel = pluginData.guild.channels.get(channelId);
            if (!channel || !(channel instanceof eris_1.TextChannel))
                continue;
            await channel.editPermission(userId, permissions, 0, "member", `Companion Channel for ${voiceChannel.id} | User Joined`);
        }
    }
    catch (e) {
        if (utils_1.isDiscordRESTError(e) && e.code === 50001) {
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Missing permissions to handle companion channels. Pausing companion channels for 5 minutes or until the bot is reloaded on this server.`,
            });
            pluginData.state.errorCooldownManager.setCooldown(ERROR_COOLDOWN_KEY, ERROR_COOLDOWN);
            return;
        }
        throw e;
    }
}
exports.handleCompanionPermissions = handleCompanionPermissions;
