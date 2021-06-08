"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessageToStarboard = void 0;
const createStarboardEmbedFromMessage_1 = require("./createStarboardEmbedFromMessage");
const createStarboardPseudoFooterForMessage_1 = require("./createStarboardPseudoFooterForMessage");
async function saveMessageToStarboard(pluginData, msg, starboard) {
    const channel = pluginData.guild.channels.get(starboard.channel_id);
    if (!channel)
        return;
    const starCount = (await pluginData.state.starboardReactions.getAllReactionsForMessageId(msg.id)).length;
    const embed = createStarboardEmbedFromMessage_1.createStarboardEmbedFromMessage(msg, Boolean(starboard.copy_full_embed), starboard.color);
    embed.fields.push(createStarboardPseudoFooterForMessage_1.createStarboardPseudoFooterForMessage(starboard, msg, starboard.star_emoji[0], starCount));
    const starboardMessage = await channel.createMessage({ embed });
    await pluginData.state.starboardMessages.createStarboardMessage(channel.id, msg.id, starboardMessage.id);
}
exports.saveMessageToStarboard = saveMessageToStarboard;
