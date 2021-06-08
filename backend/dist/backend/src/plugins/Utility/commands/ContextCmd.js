"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const eris_1 = require("eris");
const canReadChannel_1 = require("../../../utils/canReadChannel");
exports.ContextCmd = types_1.utilityCmd({
    trigger: "context",
    description: "Get a link to the context of the specified message",
    usage: "!context 94882524378968064 650391267720822785",
    permission: "can_context",
    signature: [
        {
            message: commandTypes_1.commandTypeHelpers.messageTarget(),
        },
        {
            channel: commandTypes_1.commandTypeHelpers.channel(),
            messageId: commandTypes_1.commandTypeHelpers.string(),
        },
    ],
    async run({ message: msg, args, pluginData }) {
        if (args.channel && !(args.channel instanceof eris_1.TextChannel)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Channel must be a text channel");
            return;
        }
        const channel = args.channel ?? args.message.channel;
        const messageId = args.messageId ?? args.message.messageId;
        if (!canReadChannel_1.canReadChannel(channel, msg.member)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Message context not found");
            return;
        }
        const previousMessage = (await pluginData.client.getMessages(channel.id, 1, messageId))[0];
        if (!previousMessage) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Message context not found");
            return;
        }
        msg.channel.createMessage(utils_1.messageLink(pluginData.guild.id, previousMessage.channel.id, previousMessage.id));
    },
});
