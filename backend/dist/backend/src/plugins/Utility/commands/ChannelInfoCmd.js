"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const getChannelInfoEmbed_1 = require("../functions/getChannelInfoEmbed");
exports.ChannelInfoCmd = types_1.utilityCmd({
    trigger: ["channel", "channelinfo"],
    description: "Show information about a channel",
    usage: "!channel 534722016549404673",
    permission: "can_channelinfo",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.channelId({ required: false }),
    },
    async run({ message, args, pluginData }) {
        const embed = await getChannelInfoEmbed_1.getChannelInfoEmbed(pluginData, args.channel);
        if (!embed) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Unknown channel");
            return;
        }
        message.channel.createMessage({ embed });
    },
});
