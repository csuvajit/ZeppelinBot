"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageDelete = void 0;
async function onMessageDelete(pluginData, msg) {
    // Command message was deleted -> delete the response as well
    const commandMsgResponse = await pluginData.state.tags.findResponseByCommandMessageId(msg.id);
    if (commandMsgResponse) {
        const channel = pluginData.guild.channels.get(msg.channel_id);
        if (!channel)
            return;
        const responseMsg = await pluginData.state.savedMessages.find(commandMsgResponse.response_message_id);
        if (!responseMsg || responseMsg.deleted_at != null)
            return;
        await channel.deleteMessage(commandMsgResponse.response_message_id);
        return;
    }
    // Response was deleted -> delete the command message as well
    const responseMsgResponse = await pluginData.state.tags.findResponseByResponseMessageId(msg.id);
    if (responseMsgResponse) {
        const channel = pluginData.guild.channels.get(msg.channel_id);
        if (!channel)
            return;
        const commandMsg = await pluginData.state.savedMessages.find(responseMsgResponse.command_message_id);
        if (!commandMsg || commandMsg.deleted_at != null)
            return;
        await channel.deleteMessage(responseMsgResponse.command_message_id);
        return;
    }
}
exports.onMessageDelete = onMessageDelete;
