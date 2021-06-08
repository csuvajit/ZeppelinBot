"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBanned = void 0;
const utils_1 = require("../../../utils");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const hasDiscordPermissions_1 = require("../../../utils/hasDiscordPermissions");
const eris_1 = require("eris");
async function isBanned(pluginData, userId, timeout = 5 * utils_1.SECONDS) {
    const botMember = pluginData.guild.members.get(pluginData.client.user.id);
    if (botMember && !hasDiscordPermissions_1.hasDiscordPermissions(botMember.permissions, eris_1.Constants.Permissions.banMembers)) {
        pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.BOT_ALERT, {
            body: `Missing "Ban Members" permission to check for existing bans`,
        });
        return false;
    }
    try {
        const potentialBan = await Promise.race([pluginData.guild.getBan(userId), utils_1.sleep(timeout)]);
        return potentialBan != null;
    }
    catch (e) {
        if (utils_1.isDiscordRESTError(e) && e.code === 10026) {
            // [10026]: Unknown Ban
            return false;
        }
        if (utils_1.isDiscordHTTPError(e) && e.code === 500) {
            // Internal server error, ignore
            return false;
        }
        if (utils_1.isDiscordRESTError(e) && e.code === 50013) {
            pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.BOT_ALERT, {
                body: `Missing "Ban Members" permission to check for existing bans`,
            });
        }
        throw e;
    }
}
exports.isBanned = isBanned;
