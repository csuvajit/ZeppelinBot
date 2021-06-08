"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMessageFromStarboard = void 0;
const utils_1 = require("../../../utils");
async function removeMessageFromStarboard(pluginData, msg) {
    await pluginData.client.deleteMessage(msg.starboard_channel_id, msg.starboard_message_id).catch(utils_1.noop);
}
exports.removeMessageFromStarboard = removeMessageFromStarboard;
