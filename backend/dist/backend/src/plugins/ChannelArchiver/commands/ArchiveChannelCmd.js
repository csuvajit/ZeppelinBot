"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveChannelCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const rehostAttachment_1 = require("../rehostAttachment");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const MAX_ARCHIVED_MESSAGES = 5000;
const MAX_MESSAGES_PER_FETCH = 100;
const PROGRESS_UPDATE_INTERVAL = 5 * utils_1.SECONDS;
exports.ArchiveChannelCmd = types_1.channelArchiverCmd({
    trigger: "archive_channel",
    permission: null,
    config: {
        preFilters: [
            (command, context) => {
                return pluginUtils_1.isOwner(context.pluginData, context.message.author.id);
            },
        ],
    },
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel(),
        "attachment-channel": commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
        messages: commandTypes_1.commandTypeHelpers.number({ option: true }),
    },
    async run({ message: msg, args, pluginData }) {
        if (!args["attachment-channel"]) {
            const confirmed = await utils_1.confirm(pluginData.client, msg.channel, msg.author.id, "No `-attachment-channel` specified. Continue? Attachments will not be available in the log if their message is deleted.");
            if (!confirmed) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Canceled");
                return;
            }
        }
        const maxMessagesToArchive = args.messages ? Math.min(args.messages, MAX_ARCHIVED_MESSAGES) : MAX_ARCHIVED_MESSAGES;
        if (maxMessagesToArchive <= 0)
            return;
        const archiveLines = [];
        let archivedMessages = 0;
        let previousId;
        const startTime = Date.now();
        const progressMsg = await msg.channel.createMessage("Creating archive...");
        const progressUpdateInterval = setInterval(() => {
            const secondsSinceStart = Math.round((Date.now() - startTime) / 1000);
            progressMsg
                .edit(`Creating archive...\n**Status:** ${archivedMessages} messages archived in ${secondsSinceStart} seconds`)
                .catch(() => clearInterval(progressUpdateInterval));
        }, PROGRESS_UPDATE_INTERVAL);
        while (archivedMessages < maxMessagesToArchive) {
            const messagesToFetch = Math.min(MAX_MESSAGES_PER_FETCH, maxMessagesToArchive - archivedMessages);
            const messages = await args.channel.getMessages(messagesToFetch, previousId);
            if (messages.length === 0)
                break;
            for (const message of messages) {
                const ts = moment_timezone_1.default.utc(message.timestamp).format("YYYY-MM-DD HH:mm:ss");
                let content = `[${ts}] [${message.author.id}] [${message.author.username}#${message.author.discriminator}]: ${message.content || "<no text content>"}`;
                if (message.attachments.length) {
                    if (args["attachment-channel"]) {
                        const rehostedAttachmentUrl = await rehostAttachment_1.rehostAttachment(message.attachments[0], args["attachment-channel"]);
                        content += `\n-- Attachment: ${rehostedAttachmentUrl}`;
                    }
                    else {
                        content += `\n-- Attachment: ${message.attachments[0].url}`;
                    }
                }
                if (message.reactions && Object.keys(message.reactions).length > 0) {
                    const reactionCounts = [];
                    for (const [emoji, info] of Object.entries(message.reactions)) {
                        reactionCounts.push(`${info.count}x ${emoji}`);
                    }
                    content += `\n-- Reactions: ${reactionCounts.join(", ")}`;
                }
                archiveLines.push(content);
                previousId = message.id;
                archivedMessages++;
            }
        }
        clearInterval(progressUpdateInterval);
        archiveLines.reverse();
        const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
        const nowTs = timeAndDate.inGuildTz().format(timeAndDate.getDateFormat("pretty_datetime"));
        let result = `Archived ${archiveLines.length} messages from #${args.channel.name} at ${nowTs}`;
        result += `\n\n${archiveLines.join("\n")}\n`;
        progressMsg.delete().catch(utils_1.noop);
        msg.channel.createMessage("Archive created!", {
            file: Buffer.from(result),
            name: `archive-${args.channel.name}-${moment_timezone_1.default.utc().format("YYYY-MM-DD-HH-mm-ss")}.txt`,
        });
    },
});
