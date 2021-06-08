"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveMember = void 0;
const pluginUtils_1 = require("../../../pluginUtils");
async function moveMember(pluginData, toMoveID, target, errorChannel) {
    const modMember = await pluginData.client.getRESTGuildMember(pluginData.guild.id, toMoveID);
    if (modMember.voiceState.channelID != null) {
        try {
            await modMember.edit({
                channelID: target.voiceState.channelID,
            });
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, errorChannel, "Failed to move you. Are you in a voice channel?");
            return;
        }
    }
    else {
        pluginUtils_1.sendErrorMessage(pluginData, errorChannel, "Failed to move you. Are you in a voice channel?");
    }
}
exports.moveMember = moveMember;
