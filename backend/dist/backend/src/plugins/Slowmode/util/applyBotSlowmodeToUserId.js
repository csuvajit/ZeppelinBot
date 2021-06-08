"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBotSlowmodeToUserId = void 0;
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const logger_1 = require("../../../logger");
async function applyBotSlowmodeToUserId(pluginData, channel, userId) {
    // Deny sendMessage permission from the user. If there are existing permission overwrites, take those into account.
    const existingOverride = channel.permissionOverwrites.get(userId);
    const newDeniedPermissions = (existingOverride ? existingOverride.deny : 0n) | eris_1.Constants.Permissions.sendMessages;
    const newAllowedPermissions = (existingOverride ? existingOverride.allow : 0n) & ~eris_1.Constants.Permissions.sendMessages;
    try {
        await channel.editPermission(userId, newAllowedPermissions, newDeniedPermissions, "member");
    }
    catch (e) {
        const user = pluginData.client.users.get(userId) || new utils_1.UnknownUser({ id: userId });
        if (utils_1.isDiscordRESTError(e) && e.code === 50013) {
            logger_1.logger.warn(`Missing permissions to apply bot slowmode to user ${userId} on channel ${channel.name} (${channel.id}) on server ${pluginData.guild.name} (${pluginData.guild.id})`);
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Missing permissions to apply bot slowmode to {userMention(user)} in {channelMention(channel)}`,
                user: utils_1.stripObjectToScalars(user),
                channel: utils_1.stripObjectToScalars(channel),
            });
        }
        else {
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Failed to apply bot slowmode to {userMention(user)} in {channelMention(channel)}`,
                user: utils_1.stripObjectToScalars(user),
                channel: utils_1.stripObjectToScalars(channel),
            });
            throw e;
        }
    }
    await pluginData.state.slowmodes.addSlowmodeUser(channel.id, userId);
}
exports.applyBotSlowmodeToUserId = applyBotSlowmodeToUserId;
