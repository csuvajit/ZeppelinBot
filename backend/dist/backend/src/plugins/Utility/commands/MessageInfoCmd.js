"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const getMessageInfoEmbed_1 = require("../functions/getMessageInfoEmbed");
const canReadChannel_1 = require("../../../utils/canReadChannel");
exports.MessageInfoCmd = types_1.utilityCmd({
    trigger: ["message", "messageinfo"],
    description: "Show information about a message",
    usage: "!message 534722016549404673-534722219696455701",
    permission: "can_messageinfo",
    signature: {
        message: commandTypes_1.commandTypeHelpers.messageTarget(),
    },
    async run({ message, args, pluginData }) {
        if (!canReadChannel_1.canReadChannel(args.message.channel, message.member)) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Unknown message");
            return;
        }
        const embed = await getMessageInfoEmbed_1.getMessageInfoEmbed(pluginData, args.message.channel.id, args.message.messageId, message.author.id);
        if (!embed) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Unknown message");
            return;
        }
        message.channel.createMessage({ embed });
    },
});
