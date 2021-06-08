"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCensor = void 0;
const types_1 = require("../types");
const logAndDetectMessageSpam_1 = require("./logAndDetectMessageSpam");
async function logCensor(pluginData, savedMessage) {
    const member = pluginData.guild.members.get(savedMessage.user_id);
    const config = await pluginData.config.getMatchingConfig({
        userId: savedMessage.user_id,
        channelId: savedMessage.channel_id,
        member,
    });
    const spamConfig = config.max_censor;
    if (spamConfig) {
        logAndDetectMessageSpam_1.logAndDetectMessageSpam(pluginData, savedMessage, types_1.RecentActionType.Censor, spamConfig, 1, "too many censored messages");
    }
}
exports.logCensor = logCensor;
