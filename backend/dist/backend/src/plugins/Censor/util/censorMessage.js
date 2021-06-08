"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.censorMessage = void 0;
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const helpers_1 = require("knub/dist/helpers");
async function censorMessage(pluginData, savedMessage, reason) {
    pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE, savedMessage.id);
    try {
        await pluginData.client.deleteMessage(savedMessage.channel_id, savedMessage.id, "Censored");
    }
    catch {
        return;
    }
    const user = await utils_1.resolveUser(pluginData.client, savedMessage.user_id);
    const channel = pluginData.guild.channels.get(savedMessage.channel_id);
    pluginData.state.serverLogs.log(LogType_1.LogType.CENSOR, {
        user: utils_1.stripObjectToScalars(user),
        channel: utils_1.stripObjectToScalars(channel),
        reason,
        message: savedMessage,
        messageText: helpers_1.disableCodeBlocks(helpers_1.deactivateMentions(savedMessage.data.content)),
    });
}
exports.censorMessage = censorMessage;
