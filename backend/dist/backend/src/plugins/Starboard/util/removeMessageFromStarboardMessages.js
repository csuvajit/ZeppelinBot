"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMessageFromStarboardMessages = void 0;
async function removeMessageFromStarboardMessages(pluginData, starboard_message_id, channel_id) {
    await pluginData.state.starboardMessages.deleteStarboardMessage(starboard_message_id, channel_id);
}
exports.removeMessageFromStarboardMessages = removeMessageFromStarboardMessages;
