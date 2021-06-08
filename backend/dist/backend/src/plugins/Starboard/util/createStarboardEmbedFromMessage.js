"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStarboardEmbedFromMessage = void 0;
const utils_1 = require("../../../utils");
const path_1 = __importDefault(require("path"));
const imageAttachmentExtensions = ["jpeg", "jpg", "png", "gif", "webp"];
const audioAttachmentExtensions = ["wav", "mp3", "m4a"];
const videoAttachmentExtensions = ["mp4", "mkv", "mov"];
function createStarboardEmbedFromMessage(msg, copyFullEmbed, color) {
    const embed = {
        footer: {
            text: `#${msg.channel.name}`,
        },
        author: {
            name: `${msg.author.username}#${msg.author.discriminator}`,
        },
        fields: [],
        timestamp: new Date(msg.timestamp).toISOString(),
    };
    if (color != null) {
        embed.color = color;
    }
    if (msg.author.avatarURL) {
        embed.author.icon_url = msg.author.avatarURL;
    }
    // The second condition here checks for messages with only an image link that is then embedded.
    // The message content in that case is hidden by the Discord client, so we hide it here too.
    if (msg.content && msg.embeds[0]?.thumbnail?.url !== msg.content) {
        embed.description = msg.content;
    }
    // Merge media and - if copy_full_embed is enabled - fields and title from the first embed in the original message
    if (msg.embeds.length > 0) {
        if (msg.embeds[0].image) {
            embed.image = msg.embeds[0].image;
        }
        else if (msg.embeds[0].thumbnail) {
            embed.image = { url: msg.embeds[0].thumbnail.url };
        }
        if (copyFullEmbed) {
            if (msg.embeds[0].title) {
                const titleText = msg.embeds[0].url ? `[${msg.embeds[0].title}](${msg.embeds[0].url})` : msg.embeds[0].title;
                embed.fields.push({ name: utils_1.EMPTY_CHAR, value: titleText });
            }
            if (msg.embeds[0].fields) {
                embed.fields.push(...msg.embeds[0].fields);
            }
        }
    }
    // If there are no embeds, add the first image attachment explicitly
    else if (msg.attachments.length) {
        for (const attachment of msg.attachments) {
            const ext = path_1.default
                .extname(attachment.filename)
                .slice(1)
                .toLowerCase();
            if (imageAttachmentExtensions.includes(ext)) {
                embed.image = { url: attachment.url };
                break;
            }
            if (audioAttachmentExtensions.includes(ext)) {
                embed.fields.push({ name: utils_1.EMPTY_CHAR, value: `*Message contains an audio clip*` });
                break;
            }
            if (videoAttachmentExtensions.includes(ext)) {
                embed.fields.push({ name: utils_1.EMPTY_CHAR, value: `*Message contains a video*` });
                break;
            }
        }
    }
    return embed;
}
exports.createStarboardEmbedFromMessage = createStarboardEmbedFromMessage;
