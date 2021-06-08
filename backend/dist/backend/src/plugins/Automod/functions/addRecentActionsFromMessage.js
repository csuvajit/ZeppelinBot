"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRecentActionsFromMessage = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../../../utils");
function addRecentActionsFromMessage(pluginData, context) {
    const message = context.message;
    const globalIdentifier = message.user_id;
    const perChannelIdentifier = `${message.channel_id}-${message.user_id}`;
    const expiresAt = Date.now() + constants_1.RECENT_ACTION_EXPIRY_TIME;
    pluginData.state.recentActions.push({
        context,
        type: constants_1.RecentActionType.Message,
        identifier: globalIdentifier,
        count: 1,
    });
    pluginData.state.recentActions.push({
        context,
        type: constants_1.RecentActionType.Message,
        identifier: perChannelIdentifier,
        count: 1,
    });
    const mentionCount = utils_1.getUserMentions(message.data.content || "").length + utils_1.getRoleMentions(message.data.content || "").length;
    if (mentionCount) {
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Mention,
            identifier: globalIdentifier,
            count: mentionCount,
        });
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Mention,
            identifier: perChannelIdentifier,
            count: mentionCount,
        });
    }
    const linkCount = utils_1.getUrlsInString(message.data.content || "").length;
    if (linkCount) {
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Link,
            identifier: globalIdentifier,
            count: linkCount,
        });
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Link,
            identifier: perChannelIdentifier,
            count: linkCount,
        });
    }
    const attachmentCount = message.data.attachments && message.data.attachments.length;
    if (attachmentCount) {
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Attachment,
            identifier: globalIdentifier,
            count: attachmentCount,
        });
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Attachment,
            identifier: perChannelIdentifier,
            count: attachmentCount,
        });
    }
    const emojiCount = utils_1.getEmojiInString(message.data.content || "").length;
    if (emojiCount) {
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Emoji,
            identifier: globalIdentifier,
            count: emojiCount,
        });
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Emoji,
            identifier: perChannelIdentifier,
            count: emojiCount,
        });
    }
    // + 1 is for the first line of the message (which doesn't have a line break)
    const lineCount = message.data.content ? (message.data.content.match(/\n/g) || []).length + 1 : 0;
    if (lineCount) {
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Line,
            identifier: globalIdentifier,
            count: lineCount,
        });
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Line,
            identifier: perChannelIdentifier,
            count: lineCount,
        });
    }
    const characterCount = [...(message.data.content || "")].length;
    if (characterCount) {
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Character,
            identifier: globalIdentifier,
            count: characterCount,
        });
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Character,
            identifier: perChannelIdentifier,
            count: characterCount,
        });
    }
    const stickerCount = (message.data.stickers || []).length;
    if (stickerCount) {
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Sticker,
            identifier: globalIdentifier,
            count: stickerCount,
        });
        pluginData.state.recentActions.push({
            context,
            type: constants_1.RecentActionType.Sticker,
            identifier: perChannelIdentifier,
            count: stickerCount,
        });
    }
}
exports.addRecentActionsFromMessage = addRecentActionsFromMessage;
