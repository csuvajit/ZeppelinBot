"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const canReadChannel_1 = require("../../../utils/canReadChannel");
exports.SourceCmd = types_1.utilityCmd({
    trigger: "source",
    description: "View the message source of the specified message id",
    usage: "!source 534722219696455701",
    permission: "can_source",
    signature: {
        message: commandTypes_1.commandTypeHelpers.messageTarget(),
    },
    async run({ message: cmdMessage, args, pluginData }) {
        if (!canReadChannel_1.canReadChannel(args.message.channel, cmdMessage.member)) {
            pluginUtils_1.sendErrorMessage(pluginData, cmdMessage.channel, "Unknown message");
            return;
        }
        const message = await pluginData.client
            .getMessage(args.message.channel.id, args.message.messageId)
            .catch(() => null);
        if (!message) {
            pluginUtils_1.sendErrorMessage(pluginData, cmdMessage.channel, "Unknown message");
            return;
        }
        const textSource = message.content || "<no text content>";
        const fullSource = JSON.stringify({
            id: message.id,
            content: message.content,
            attachments: message.attachments,
            embeds: message.embeds,
            stickers: message.stickers,
        });
        const source = `${textSource}\n\nSource:\n\n${fullSource}`;
        const archiveId = await pluginData.state.archives.create(source, moment_timezone_1.default.utc().add(1, "hour"));
        const baseUrl = pluginUtils_1.getBaseUrl(pluginData);
        const url = pluginData.state.archives.getUrl(baseUrl, archiveId);
        cmdMessage.channel.createMessage(`Message source: ${url}`);
    },
});
