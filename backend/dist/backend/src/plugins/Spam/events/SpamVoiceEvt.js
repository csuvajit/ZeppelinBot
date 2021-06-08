"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpamVoiceSwitchEvt = exports.SpamVoiceJoinEvt = void 0;
const types_1 = require("../types");
const logAndDetectOtherSpam_1 = require("../util/logAndDetectOtherSpam");
exports.SpamVoiceJoinEvt = types_1.spamEvt({
    event: "voiceChannelJoin",
    async listener(meta) {
        const member = meta.args.member;
        const channel = meta.args.newChannel;
        const config = await meta.pluginData.config.getMatchingConfig({ member, channelId: channel.id });
        const maxVoiceMoves = config.max_voice_moves;
        if (maxVoiceMoves) {
            logAndDetectOtherSpam_1.logAndDetectOtherSpam(meta.pluginData, types_1.RecentActionType.VoiceChannelMove, maxVoiceMoves, member.id, 1, "0", Date.now(), null, "too many voice channel moves");
        }
    },
});
exports.SpamVoiceSwitchEvt = types_1.spamEvt({
    event: "voiceChannelSwitch",
    async listener(meta) {
        const member = meta.args.member;
        const channel = meta.args.newChannel;
        const config = await meta.pluginData.config.getMatchingConfig({ member, channelId: channel.id });
        const maxVoiceMoves = config.max_voice_moves;
        if (maxVoiceMoves) {
            logAndDetectOtherSpam_1.logAndDetectOtherSpam(meta.pluginData, types_1.RecentActionType.VoiceChannelMove, maxVoiceMoves, member.id, 1, "0", Date.now(), null, "too many voice channel moves");
        }
    },
});
