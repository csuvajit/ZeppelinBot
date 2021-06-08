"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetCounterCmd = void 0;
const knub_1 = require("knub");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const helpers_1 = require("knub/dist/helpers");
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const setCounterValue_1 = require("../functions/setCounterValue");
exports.ResetCounterCmd = knub_1.typedGuildCommand()({
    trigger: ["counters reset", "counter reset", "resetcounter"],
    permission: "can_edit",
    signature: [
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            user: commandTypes_1.commandTypeHelpers.resolvedUser(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            channel: commandTypes_1.commandTypeHelpers.textChannel(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            channel: commandTypes_1.commandTypeHelpers.textChannel(),
            user: commandTypes_1.commandTypeHelpers.resolvedUser(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            user: commandTypes_1.commandTypeHelpers.resolvedUser(),
            channel: commandTypes_1.commandTypeHelpers.textChannel(),
        },
    ],
    async run({ pluginData, message, args }) {
        const config = await pluginData.config.getForMessage(message);
        const counter = config.counters[args.counterName];
        const counterId = pluginData.state.counterIds[args.counterName];
        if (!counter || !counterId) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, `Unknown counter: ${args.counterName}`);
            return;
        }
        if (counter.can_edit === false) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, `Missing permissions to reset this counter's value`);
            return;
        }
        if (args.channel && !counter.per_channel) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, `This counter is not per-channel`);
            return;
        }
        if (args.user && !counter.per_user) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, `This counter is not per-user`);
            return;
        }
        let channel = args.channel;
        if (!channel && counter.per_channel) {
            message.channel.createMessage(`Which channel's counter value would you like to reset?`);
            const reply = await helpers_1.waitForReply(pluginData.client, message.channel, message.author.id);
            if (!reply || !reply.content) {
                pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Cancelling");
                return;
            }
            const potentialChannel = helpers_1.resolveChannel(pluginData.guild, reply.content);
            if (!potentialChannel || !(potentialChannel instanceof eris_1.TextChannel)) {
                pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Channel is not a text channel, cancelling");
                return;
            }
            channel = potentialChannel;
        }
        let user = args.user;
        if (!user && counter.per_user) {
            message.channel.createMessage(`Which user's counter value would you like to reset?`);
            const reply = await helpers_1.waitForReply(pluginData.client, message.channel, message.author.id);
            if (!reply || !reply.content) {
                pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Cancelling");
                return;
            }
            const potentialUser = await utils_1.resolveUser(pluginData.client, reply.content);
            if (!potentialUser || potentialUser instanceof utils_1.UnknownUser) {
                pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Unknown user, cancelling");
                return;
            }
            user = potentialUser;
        }
        await setCounterValue_1.setCounterValue(pluginData, args.counterName, channel?.id ?? null, user?.id ?? null, counter.initial_value);
        const counterName = counter.name || args.counterName;
        if (channel && user) {
            message.channel.createMessage(`Reset **${counterName}** for <@!${user.id}> in <#${channel.id}>`);
        }
        else if (channel) {
            message.channel.createMessage(`Reset **${counterName}** in <#${channel.id}>`);
        }
        else if (user) {
            message.channel.createMessage(`Reset **${counterName}** for <@!${user.id}>`);
        }
        else {
            message.channel.createMessage(`Reset **${counterName}**`);
        }
    },
});
