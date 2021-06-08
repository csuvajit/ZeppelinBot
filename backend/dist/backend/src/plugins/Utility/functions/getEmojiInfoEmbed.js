"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmojiInfoEmbed = void 0;
const utils_1 = require("../../../utils");
async function getEmojiInfoEmbed(pluginData, emojiId) {
    const emoji = pluginData.guild.emojis.find(e => e.id === emojiId);
    if (!emoji) {
        return null;
    }
    const embed = {
        fields: [],
    };
    embed.author = {
        name: `Emoji:  ${emoji.name}`,
        icon_url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}?v=1`,
    };
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Emoji information",
        value: utils_1.trimLines(`
      Name: **${emoji.name}**
      ID: \`${emoji.id}\`
      Animated: **${emoji.animated ? "Yes" : "No"}**
    `),
    });
    return embed;
}
exports.getEmojiInfoEmbed = getEmojiInfoEmbed;
