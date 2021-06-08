"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreate = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const addMessageToDeletionQueue_1 = require("./addMessageToDeletionQueue");
async function onMessageCreate(pluginData, msg) {
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, msg.user_id);
    const config = await pluginData.config.getMatchingConfig({ member, channelId: msg.channel_id });
    if (config.enabled) {
        let delay = utils_1.convertDelayStringToMS(config.delay);
        if (delay > types_1.MAX_DELAY) {
            delay = types_1.MAX_DELAY;
            if (!pluginData.state.maxDelayWarningSent) {
                pluginData.state.guildLogs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Clamped auto-deletion delay in <#${msg.channel_id}> to 5 minutes`,
                });
                pluginData.state.maxDelayWarningSent = true;
            }
        }
        addMessageToDeletionQueue_1.addMessageToDeletionQueue(pluginData, msg, delay);
    }
}
exports.onMessageCreate = onMessageCreate;
