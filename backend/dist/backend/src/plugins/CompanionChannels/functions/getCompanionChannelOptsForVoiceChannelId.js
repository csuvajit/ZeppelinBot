"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanionChannelOptsForVoiceChannelId = void 0;
const defaultCompanionChannelOpts = {
    enabled: true,
};
async function getCompanionChannelOptsForVoiceChannelId(pluginData, userId, voiceChannel) {
    const config = await pluginData.config.getMatchingConfig({ userId, channelId: voiceChannel.id });
    return Object.values(config.entries)
        .filter(opts => opts.voice_channel_ids.includes(voiceChannel.id) ||
        (voiceChannel.parentID && opts.voice_channel_ids.includes(voiceChannel.parentID)))
        .map(opts => Object.assign({}, defaultCompanionChannelOpts, opts));
}
exports.getCompanionChannelOptsForVoiceChannelId = getCompanionChannelOptsForVoiceChannelId;
