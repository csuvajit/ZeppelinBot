"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const eris_1 = require("eris");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const LogType_1 = require("../../../data/LogType");
const RegExpRunner_1 = require("../../../RegExpRunner");
const ModActionsPlugin_1 = require("../../../plugins/ModActions/ModActionsPlugin");
const MAX_CLEAN_COUNT = 150;
const MAX_CLEAN_TIME = 1 * utils_1.DAYS;
const CLEAN_COMMAND_DELETE_DELAY = 5 * utils_1.SECONDS;
async function cleanMessages(pluginData, channel, savedMessages, mod) {
    pluginData.state.logs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE, savedMessages[0].id);
    pluginData.state.logs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE_BULK, savedMessages[0].id);
    // Delete & archive in ID order
    savedMessages = Array.from(savedMessages).sort((a, b) => (a.id > b.id ? 1 : -1));
    const idsToDelete = savedMessages.map(m => m.id);
    // Make sure the deletions aren't double logged
    idsToDelete.forEach(id => pluginData.state.logs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE, id));
    pluginData.state.logs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE_BULK, idsToDelete[0]);
    // Actually delete the messages
    await pluginData.client.deleteMessages(channel.id, idsToDelete);
    await pluginData.state.savedMessages.markBulkAsDeleted(idsToDelete);
    // Create an archive
    const archiveId = await pluginData.state.archives.createFromSavedMessages(savedMessages, pluginData.guild);
    const baseUrl = pluginUtils_1.getBaseUrl(pluginData);
    const archiveUrl = pluginData.state.archives.getUrl(baseUrl, archiveId);
    pluginData.state.logs.log(LogType_1.LogType.CLEAN, {
        mod: utils_1.stripObjectToScalars(mod),
        channel: utils_1.stripObjectToScalars(channel),
        count: savedMessages.length,
        archiveUrl,
    });
    return { archiveUrl };
}
const opts = {
    user: commandTypes_1.commandTypeHelpers.userId({ option: true, shortcut: "u" }),
    channel: commandTypes_1.commandTypeHelpers.channelId({ option: true, shortcut: "c" }),
    bots: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "b" }),
    "delete-pins": commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "p" }),
    "has-invites": commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "i" }),
    match: commandTypes_1.commandTypeHelpers.regex({ option: true, shortcut: "m" }),
    "to-id": commandTypes_1.commandTypeHelpers.anyId({ option: true, shortcut: "id" }),
};
exports.CleanCmd = types_1.utilityCmd({
    trigger: ["clean", "clear"],
    description: "Remove a number of recent messages",
    usage: "!clean 20",
    permission: "can_clean",
    signature: [
        {
            count: commandTypes_1.commandTypeHelpers.number(),
            update: commandTypes_1.commandTypeHelpers.number({ option: true, shortcut: "up" }),
            ...opts,
        },
        {
            count: commandTypes_1.commandTypeHelpers.number(),
            update: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "up" }),
            ...opts,
        },
    ],
    async run({ message: msg, args, pluginData }) {
        if (args.count > MAX_CLEAN_COUNT || args.count <= 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Clean count must be between 1 and ${MAX_CLEAN_COUNT}`);
            return;
        }
        const targetChannel = args.channel ? pluginData.guild.channels.get(args.channel) : msg.channel;
        if (!targetChannel || !(targetChannel instanceof eris_1.TextChannel)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Invalid channel specified`);
            return;
        }
        if (targetChannel.id !== msg.channel.id) {
            const configForTargetChannel = await pluginData.config.getMatchingConfig({
                userId: msg.author.id,
                member: msg.member,
                channelId: targetChannel.id,
                categoryId: targetChannel.parentID,
            });
            if (configForTargetChannel.can_clean !== true) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Missing permissions to use clean on that channel`);
                return;
            }
        }
        const cleaningMessage = msg.channel.createMessage("Cleaning...");
        const messagesToClean = [];
        let beforeId = msg.id;
        const timeCutoff = msg.timestamp - MAX_CLEAN_TIME;
        const upToMsgId = args["to-id"];
        let foundId = false;
        const deletePins = args["delete-pins"] != null ? args["delete-pins"] : false;
        let pins = [];
        if (!deletePins) {
            pins = await msg.channel.getPins();
        }
        while (messagesToClean.length < args.count) {
            const potentialMessagesToClean = await pluginData.state.savedMessages.getLatestByChannelBeforeId(targetChannel.id, beforeId, args.count);
            if (potentialMessagesToClean.length === 0)
                break;
            const filtered = [];
            for (const message of potentialMessagesToClean) {
                const contentString = message.data.content || "";
                if (args.user && message.user_id !== args.user)
                    continue;
                if (args.bots && !message.is_bot)
                    continue;
                if (!deletePins && pins.find(x => x.id === message.id) != null)
                    continue;
                if (args["has-invites"] && utils_1.getInviteCodesInString(contentString).length === 0)
                    continue;
                if (upToMsgId != null && message.id < upToMsgId) {
                    foundId = true;
                    break;
                }
                if (moment_timezone_1.default.utc(message.posted_at).valueOf() < timeCutoff)
                    continue;
                if (args.match && !(await pluginData.state.regexRunner.exec(args.match, contentString).catch(RegExpRunner_1.allowTimeout))) {
                    continue;
                }
                filtered.push(message);
            }
            const remaining = args.count - messagesToClean.length;
            const withoutOverflow = filtered.slice(0, remaining);
            messagesToClean.push(...withoutOverflow);
            beforeId = potentialMessagesToClean[potentialMessagesToClean.length - 1].id;
            if (foundId ||
                moment_timezone_1.default.utc(potentialMessagesToClean[potentialMessagesToClean.length - 1].posted_at).valueOf() < timeCutoff) {
                break;
            }
        }
        let responseMsg;
        if (messagesToClean.length > 0) {
            const cleanResult = await cleanMessages(pluginData, targetChannel, messagesToClean, msg.author);
            let responseText = `Cleaned ${messagesToClean.length} ${messagesToClean.length === 1 ? "message" : "messages"}`;
            if (targetChannel.id !== msg.channel.id) {
                responseText += ` in <#${targetChannel.id}>\n${cleanResult.archiveUrl}`;
            }
            if (args.update) {
                const modActions = pluginData.getPlugin(ModActionsPlugin_1.ModActionsPlugin);
                const channelId = targetChannel.id !== msg.channel.id ? targetChannel.id : msg.channel.id;
                const updateMessage = `Cleaned ${messagesToClean.length} ${messagesToClean.length === 1 ? "message" : "messages"} in <#${channelId}>: ${cleanResult.archiveUrl}`;
                if (typeof args.update === "number") {
                    modActions.updateCase(msg, args.update, updateMessage);
                }
                else {
                    modActions.updateCase(msg, null, updateMessage);
                }
            }
            responseMsg = await pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, responseText);
        }
        else {
            responseMsg = await pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Found no messages to clean!`);
        }
        await (await cleaningMessage).delete();
        if (targetChannel.id === msg.channel.id) {
            // Delete the !clean command and the bot response if a different channel wasn't specified
            // (so as not to spam the cleaned channel with the command itself)
            setTimeout(() => {
                msg.delete().catch(utils_1.noop);
                responseMsg?.delete().catch(utils_1.noop);
            }, CLEAN_COMMAND_DELETE_DELAY);
        }
    },
});
