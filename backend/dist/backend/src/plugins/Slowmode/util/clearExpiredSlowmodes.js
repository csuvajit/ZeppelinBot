"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearExpiredSlowmodes = void 0;
const LogType_1 = require("../../../data/LogType");
const logger_1 = require("../../../logger");
const utils_1 = require("../../../utils");
const clearBotSlowmodeFromUserId_1 = require("./clearBotSlowmodeFromUserId");
async function clearExpiredSlowmodes(pluginData) {
    const expiredSlowmodeUsers = await pluginData.state.slowmodes.getExpiredSlowmodeUsers();
    for (const user of expiredSlowmodeUsers) {
        const channel = pluginData.guild.channels.get(user.channel_id);
        if (!channel) {
            await pluginData.state.slowmodes.clearSlowmodeUser(user.channel_id, user.user_id);
            continue;
        }
        try {
            await clearBotSlowmodeFromUserId_1.clearBotSlowmodeFromUserId(pluginData, channel, user.user_id);
        }
        catch (e) {
            logger_1.logger.error(e);
            const realUser = pluginData.client.users.get(user.user_id) || new utils_1.UnknownUser({ id: user.user_id });
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Failed to clear slowmode permissions from {userMention(user)} in {channelMention(channel)}`,
                user: utils_1.stripObjectToScalars(realUser),
                channel: utils_1.stripObjectToScalars(channel),
            });
        }
    }
}
exports.clearExpiredSlowmodes = clearExpiredSlowmodes;
