"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageDeleteBulk = void 0;
const LogType_1 = require("../../../data/LogType");
const pluginUtils_1 = require("../../../pluginUtils");
async function onMessageDeleteBulk(pluginData, savedMessages) {
    const channel = pluginData.guild.channels.get(savedMessages[0].channel_id);
    const archiveId = await pluginData.state.archives.createFromSavedMessages(savedMessages, pluginData.guild);
    const archiveUrl = pluginData.state.archives.getUrl(pluginUtils_1.getBaseUrl(pluginData), archiveId);
    const authorIds = Array.from(new Set(savedMessages.map(item => `\`${item.user_id}\``))).join(", ");
    pluginData.state.guildLogs.log(LogType_1.LogType.MESSAGE_DELETE_BULK, {
        count: savedMessages.length,
        authorIds,
        channel,
        archiveUrl,
    }, savedMessages[0].id);
}
exports.onMessageDeleteBulk = onMessageDeleteBulk;
