"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JumboCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const twemoji_1 = __importDefault(require("twemoji"));
const pluginUtils_1 = require("../../../pluginUtils");
const fsp = fs_1.default.promises;
async function getBufferFromUrl(url) {
    const downloadedEmoji = await utils_1.downloadFile(url);
    return fsp.readFile(downloadedEmoji.path);
}
async function resizeBuffer(input, width, height) {
    return sharp_1.default(input, { density: 800 })
        .resize(width, height, {
        fit: "inside",
    })
        .toBuffer();
}
const CDN_URL = "https://twemoji.maxcdn.com/2/svg";
exports.JumboCmd = types_1.utilityCmd({
    trigger: "jumbo",
    description: "Makes an emoji jumbo",
    permission: "can_jumbo",
    cooldown: 5 * utils_1.SECONDS,
    signature: {
        emoji: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ message: msg, args, pluginData }) {
        // Get emoji url
        const config = pluginData.config.get();
        const size = config.jumbo_size > 2048 ? 2048 : config.jumbo_size;
        const emojiRegex = new RegExp(`(<.*:).*:(\\d+)`);
        const results = emojiRegex.exec(args.emoji);
        let extention = ".png";
        let file;
        if (!utils_1.isEmoji(args.emoji)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid emoji");
            return;
        }
        if (results) {
            let url = "https://cdn.discordapp.com/emojis/";
            if (results[1] === "<a:") {
                extention = ".gif";
            }
            url += `${results[2]}${extention}`;
            if (extention === ".png") {
                const image = await resizeBuffer(await getBufferFromUrl(url), size, size);
                file = {
                    name: `emoji${extention}`,
                    file: image,
                };
            }
            else {
                const image = await getBufferFromUrl(url);
                file = {
                    name: `emoji${extention}`,
                    file: image,
                };
            }
        }
        else {
            let url = CDN_URL + `/${twemoji_1.default.convert.toCodePoint(args.emoji)}.svg`;
            let image;
            try {
                image = await resizeBuffer(await getBufferFromUrl(url), size, size);
            }
            catch {
                if (url.toLocaleLowerCase().endsWith("fe0f.svg")) {
                    url = url.slice(0, url.lastIndexOf("-fe0f")) + ".svg";
                    image = await resizeBuffer(await getBufferFromUrl(url), size, size);
                }
            }
            file = {
                name: `emoji.png`,
                file: image,
            };
        }
        msg.channel.createMessage("", file);
    },
});
