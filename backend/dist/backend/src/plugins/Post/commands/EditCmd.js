"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const formatContent_1 = require("../util/formatContent");
exports.EditCmd = types_1.postCmd({
    trigger: "edit",
    permission: "can_post",
    signature: {
        message: commandTypes_1.commandTypeHelpers.messageTarget(),
        content: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const savedMessage = await pluginData.state.savedMessages.find(args.message.messageId);
        if (!savedMessage) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown message");
            return;
        }
        if (savedMessage.user_id !== pluginData.client.user.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Message wasn't posted by me");
            return;
        }
        await pluginData.client.editMessage(savedMessage.channel_id, savedMessage.id, formatContent_1.formatContent(args.content));
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Message edited");
    },
});
