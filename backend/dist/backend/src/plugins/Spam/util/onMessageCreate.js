"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreate = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const logAndDetectMessageSpam_1 = require("./logAndDetectMessageSpam");
async function onMessageCreate(pluginData, savedMessage) {
    if (savedMessage.is_bot)
        return;
    const member = pluginData.guild.members.get(savedMessage.user_id);
    const config = await pluginData.config.getMatchingConfig({
        userId: savedMessage.user_id,
        channelId: savedMessage.channel_id,
        member,
    });
    const maxMessages = config.max_messages;
    if (maxMessages) {
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Message, maxMessages, 1, "too many messages");
    }
    const maxMentions = config.max_mentions;
    const mentions = savedMessage.data.content
        ? [...utils_1.getUserMentions(savedMessage.data.content), ...utils_1.getRoleMentions(savedMessage.data.content)]
        : [];
    if (maxMentions && mentions.length) {
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Mention, maxMentions, mentions.length, "too many mentions");
    }
    const maxLinks = config.max_links;
    if (maxLinks && savedMessage.data.content && typeof savedMessage.data.content === "string") {
        const links = utils_1.getUrlsInString(savedMessage.data.content);
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Link, maxLinks, links.length, "too many links");
    }
    const maxAttachments = config.max_attachments;
    if (maxAttachments && savedMessage.data.attachments) {
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Attachment, maxAttachments, savedMessage.data.attachments.length, "too many attachments");
    }
    const maxEmojis = config.max_emojis;
    if (maxEmojis && savedMessage.data.content) {
        const emojiCount = utils_1.getEmojiInString(savedMessage.data.content).length;
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Emoji, maxEmojis, emojiCount, "too many emoji");
    }
    const maxNewlines = config.max_newlines;
    if (maxNewlines && savedMessage.data.content) {
        const newlineCount = (savedMessage.data.content.match(/\n/g) || []).length;
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Newline, maxNewlines, newlineCount, "too many newlines");
    }
    const maxCharacters = config.max_characters;
    if (maxCharacters && savedMessage.data.content) {
        const characterCount = [...savedMessage.data.content.trim()].length;
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Character, maxCharacters, characterCount, "too many characters");
    }
    // TODO: Max duplicates check
}
exports.onMessageCreate = onMessageCreate;
