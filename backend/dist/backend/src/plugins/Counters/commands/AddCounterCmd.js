"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCounterCmd = void 0;
const knub_1 = require("knub");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const helpers_1 = require("knub/dist/helpers");
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const changeCounterValue_1 = require("../functions/changeCounterValue");
exports.AddCounterCmd = knub_1.typedGuildCommand()({
    trigger: ["counters add", "counter add", "addcounter"],
    permission: "can_edit",
    signature: [
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            amount: commandTypes_1.commandTypeHelpers.number(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            user: commandTypes_1.commandTypeHelpers.resolvedUser(),
            amount: commandTypes_1.commandTypeHelpers.number(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            channel: commandTypes_1.commandTypeHelpers.textChannel(),
            amount: commandTypes_1.commandTypeHelpers.number(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            channel: commandTypes_1.commandTypeHelpers.textChannel(),
            user: commandTypes_1.commandTypeHelpers.resolvedUser(),
            amount: commandTypes_1.commandTypeHelpers.number(),
        },
        {
            counterName: commandTypes_1.commandTypeHelpers.string(),
            user: commandTypes_1.commandTypeHelpers.resolvedUser(),
            channel: commandTypes_1.commandTypeHelpers.textChannel(),
            amount: commandTypes_1.commandTypeHelpers.number(),
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
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, `Missing permissions to edit this counter's value`);
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
            message.channel.createMessage(`Which channel's counter value would you like to add to?`);
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
            message.channel.createMessage(`Which user's counter value would you like to add to?`);
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
        let amount = args.amount;
        if (!amount) {
            message.channel.createMessage("How much would you like to add to the counter's value?");
            const reply = await helpers_1.waitForReply(pluginData.client, message.channel, message.author.id);
            if (!reply || !reply.content) {
                pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Cancelling");
                return;
            }
            const potentialAmount = parseInt(reply.content, 10);
            if (!potentialAmount) {
                pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Not a number, cancelling");
                return;
            }
            amount = potentialAmount;
        }
        await changeCounterValue_1.changeCounterValue(pluginData, args.counterName, channel?.id ?? null, user?.id ?? null, amount);
        const newValue = await pluginData.state.counters.getCurrentValue(counterId, channel?.id ?? null, user?.id ?? null);
        const counterName = counter.name || args.counterName;
        if (channel && user) {
            message.channel.createMessage(`Added ${amount} to **${counterName}** for <@!${user.id}> in <#${channel.id}>. The value is now ${newValue}.`);
        }
        else if (channel) {
            message.channel.createMessage(`Added ${amount} to **${counterName}** in <#${channel.id}>. The value is now ${newValue}.`);
        }
        else if (user) {
            message.channel.createMessage(`Added ${amount} to **${counterName}** for <@!${user.id}>. The value is now ${newValue}.`);
        }
        else {
            message.channel.createMessage(`Added ${amount} to **${counterName}**. The value is now ${newValue}.`);
        }
    },
});
