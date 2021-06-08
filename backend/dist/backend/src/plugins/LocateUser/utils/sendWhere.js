"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhere = void 0;
const helpers_1 = require("knub/dist/helpers");
const createOrReuseInvite_1 = require("./createOrReuseInvite");
const pluginUtils_1 = require("../../../pluginUtils");
async function sendWhere(pluginData, member, channel, prepend) {
    const voice = member.voiceState.channelID
        ? pluginData.guild.channels.get(member.voiceState.channelID)
        : null;
    if (voice == null) {
        channel.createMessage(prepend + "That user is not in a channel");
    }
    else {
        let invite;
        try {
            invite = await createOrReuseInvite_1.createOrReuseInvite(voice);
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, channel, "Cannot create an invite to that channel!");
            return;
        }
        channel.createMessage({
            content: prepend + `${member.mention} is in the following channel: \`${voice.name}\` ${helpers_1.getInviteLink(invite)}`,
            allowedMentions: { users: true },
        });
    }
}
exports.sendWhere = sendWhere;
