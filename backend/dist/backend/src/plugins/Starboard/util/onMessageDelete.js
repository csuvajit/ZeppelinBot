"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageDelete = void 0;
const removeMessageFromStarboard_1 = require("./removeMessageFromStarboard");
const removeMessageFromStarboardMessages_1 = require("./removeMessageFromStarboardMessages");
async function onMessageDelete(pluginData, msg) {
    // Deleted source message
    const starboardMessages = await pluginData.state.starboardMessages.getStarboardMessagesForMessageId(msg.id);
    for (const starboardMessage of starboardMessages) {
        removeMessageFromStarboard_1.removeMessageFromStarboard(pluginData, starboardMessage);
    }
    // Deleted message from the starboard
    const deletedStarboardMessages = await pluginData.state.starboardMessages.getStarboardMessagesForStarboardMessageId(msg.id);
    if (deletedStarboardMessages.length === 0)
        return;
    for (const starboardMessage of deletedStarboardMessages) {
        removeMessageFromStarboardMessages_1.removeMessageFromStarboardMessages(pluginData, starboardMessage.starboard_message_id, starboardMessage.starboard_channel_id);
    }
}
exports.onMessageDelete = onMessageDelete;
