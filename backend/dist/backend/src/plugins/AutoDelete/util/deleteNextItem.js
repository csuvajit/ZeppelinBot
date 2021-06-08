"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNextItem = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const logger_1 = require("../../../logger");
const scheduleNextDeletion_1 = require("./scheduleNextDeletion");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const hasDiscordPermissions_1 = require("../../../utils/hasDiscordPermissions");
const eris_1 = require("eris");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
async function deleteNextItem(pluginData) {
    const [itemToDelete] = pluginData.state.deletionQueue.splice(0, 1);
    if (!itemToDelete)
        return;
    scheduleNextDeletion_1.scheduleNextDeletion(pluginData);
    const channel = pluginData.guild.channels.get(itemToDelete.message.channel_id);
    if (!channel) {
        // Channel was deleted, ignore
        return;
    }
    const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
    const perms = channel.permissionsOf(pluginData.client.user.id);
    if (!hasDiscordPermissions_1.hasDiscordPermissions(perms, eris_1.Constants.Permissions.readMessages | eris_1.Constants.Permissions.readMessageHistory)) {
        logs.log(LogType_1.LogType.BOT_ALERT, {
            body: `Missing permissions to read messages or message history in auto-delete channel ${utils_1.verboseChannelMention(channel)}`,
        });
        return;
    }
    if (!hasDiscordPermissions_1.hasDiscordPermissions(perms, eris_1.Constants.Permissions.manageMessages)) {
        logs.log(LogType_1.LogType.BOT_ALERT, {
            body: `Missing permissions to delete messages in auto-delete channel ${utils_1.verboseChannelMention(channel)}`,
        });
        return;
    }
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    pluginData.state.guildLogs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE, itemToDelete.message.id);
    pluginData.client.deleteMessage(itemToDelete.message.channel_id, itemToDelete.message.id).catch(err => {
        if (err.code === 10008) {
            // "Unknown Message", probably already deleted by automod or another bot, ignore
            return;
        }
        logger_1.logger.warn(err);
    });
    const user = await utils_1.resolveUser(pluginData.client, itemToDelete.message.user_id);
    const messageDate = timeAndDate
        .inGuildTz(moment_timezone_1.default.utc(itemToDelete.message.data.timestamp, "x"))
        .format(timeAndDate.getDateFormat("pretty_datetime"));
    pluginData.state.guildLogs.log(LogType_1.LogType.MESSAGE_DELETE_AUTO, {
        message: itemToDelete.message,
        user: utils_1.stripObjectToScalars(user),
        channel: utils_1.stripObjectToScalars(channel),
        messageDate,
    });
}
exports.deleteNextItem = deleteNextItem;
