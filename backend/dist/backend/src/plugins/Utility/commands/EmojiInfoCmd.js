"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const getEmojiInfoEmbed_1 = require("../functions/getEmojiInfoEmbed");
exports.EmojiInfoCmd = types_1.utilityCmd({
    trigger: ["emoji", "emojiinfo"],
    description: "Show information about an emoji",
    usage: "!emoji 106391128718245888",
    permission: "can_emojiinfo",
    signature: {
        emoji: commandTypes_1.commandTypeHelpers.string({ required: false }),
    },
    async run({ message, args, pluginData }) {
        const emojiIdMatch = args.emoji.match(utils_1.customEmojiRegex);
        if (!emojiIdMatch?.[2]) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Emoji not found");
            return;
        }
        const embed = await getEmojiInfoEmbed_1.getEmojiInfoEmbed(pluginData, emojiIdMatch[2]);
        if (!embed) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Emoji not found");
            return;
        }
        message.channel.createMessage({ embed });
    },
});
