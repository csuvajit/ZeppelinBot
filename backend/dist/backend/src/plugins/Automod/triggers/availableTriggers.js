"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableTriggers = exports.availableTriggers = void 0;
const t = __importStar(require("io-ts"));
const matchWords_1 = require("./matchWords");
const messageSpam_1 = require("./messageSpam");
const mentionSpam_1 = require("./mentionSpam");
const linkSpam_1 = require("./linkSpam");
const attachmentSpam_1 = require("./attachmentSpam");
const emojiSpam_1 = require("./emojiSpam");
const lineSpam_1 = require("./lineSpam");
const characterSpam_1 = require("./characterSpam");
const matchRegex_1 = require("./matchRegex");
const matchInvites_1 = require("./matchInvites");
const matchLinks_1 = require("./matchLinks");
const matchAttachmentType_1 = require("./matchAttachmentType");
const memberJoinSpam_1 = require("./memberJoinSpam");
const memberJoin_1 = require("./memberJoin");
const roleAdded_1 = require("./roleAdded");
const roleRemoved_1 = require("./roleRemoved");
const stickerSpam_1 = require("./stickerSpam");
const counterTrigger_1 = require("./counterTrigger");
const note_1 = require("./note");
const warn_1 = require("./warn");
const mute_1 = require("./mute");
const unmute_1 = require("./unmute");
const kick_1 = require("./kick");
const ban_1 = require("./ban");
const unban_1 = require("./unban");
const anyMessage_1 = require("./anyMessage");
const antiraidLevel_1 = require("./antiraidLevel");
exports.availableTriggers = {
    any_message: anyMessage_1.AnyMessageTrigger,
    match_words: matchWords_1.MatchWordsTrigger,
    match_regex: matchRegex_1.MatchRegexTrigger,
    match_invites: matchInvites_1.MatchInvitesTrigger,
    match_links: matchLinks_1.MatchLinksTrigger,
    match_attachment_type: matchAttachmentType_1.MatchAttachmentTypeTrigger,
    member_join: memberJoin_1.MemberJoinTrigger,
    role_added: roleAdded_1.RoleAddedTrigger,
    role_removed: roleRemoved_1.RoleRemovedTrigger,
    message_spam: messageSpam_1.MessageSpamTrigger,
    mention_spam: mentionSpam_1.MentionSpamTrigger,
    link_spam: linkSpam_1.LinkSpamTrigger,
    attachment_spam: attachmentSpam_1.AttachmentSpamTrigger,
    emoji_spam: emojiSpam_1.EmojiSpamTrigger,
    line_spam: lineSpam_1.LineSpamTrigger,
    character_spam: characterSpam_1.CharacterSpamTrigger,
    member_join_spam: memberJoinSpam_1.MemberJoinSpamTrigger,
    sticker_spam: stickerSpam_1.StickerSpamTrigger,
    counter_trigger: counterTrigger_1.CounterTrigger,
    note: note_1.NoteTrigger,
    warn: warn_1.WarnTrigger,
    mute: mute_1.MuteTrigger,
    unmute: unmute_1.UnmuteTrigger,
    kick: kick_1.KickTrigger,
    ban: ban_1.BanTrigger,
    unban: unban_1.UnbanTrigger,
    antiraid_level: antiraidLevel_1.AntiraidLevelTrigger,
};
exports.AvailableTriggers = t.type({
    any_message: anyMessage_1.AnyMessageTrigger.configType,
    match_words: matchWords_1.MatchWordsTrigger.configType,
    match_regex: matchRegex_1.MatchRegexTrigger.configType,
    match_invites: matchInvites_1.MatchInvitesTrigger.configType,
    match_links: matchLinks_1.MatchLinksTrigger.configType,
    match_attachment_type: matchAttachmentType_1.MatchAttachmentTypeTrigger.configType,
    member_join: memberJoin_1.MemberJoinTrigger.configType,
    role_added: roleAdded_1.RoleAddedTrigger.configType,
    role_removed: roleRemoved_1.RoleRemovedTrigger.configType,
    message_spam: messageSpam_1.MessageSpamTrigger.configType,
    mention_spam: mentionSpam_1.MentionSpamTrigger.configType,
    link_spam: linkSpam_1.LinkSpamTrigger.configType,
    attachment_spam: attachmentSpam_1.AttachmentSpamTrigger.configType,
    emoji_spam: emojiSpam_1.EmojiSpamTrigger.configType,
    line_spam: lineSpam_1.LineSpamTrigger.configType,
    character_spam: characterSpam_1.CharacterSpamTrigger.configType,
    member_join_spam: memberJoinSpam_1.MemberJoinSpamTrigger.configType,
    sticker_spam: stickerSpam_1.StickerSpamTrigger.configType,
    counter_trigger: counterTrigger_1.CounterTrigger.configType,
    note: note_1.NoteTrigger.configType,
    warn: warn_1.WarnTrigger.configType,
    mute: mute_1.MuteTrigger.configType,
    unmute: unmute_1.UnmuteTrigger.configType,
    kick: kick_1.KickTrigger.configType,
    ban: ban_1.BanTrigger.configType,
    unban: unban_1.UnbanTrigger.configType,
    antiraid_level: antiraidLevel_1.AntiraidLevelTrigger.configType,
});
