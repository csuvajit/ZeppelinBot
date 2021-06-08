"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutomodOnCounterTrigger = void 0;
const runAutomod_1 = require("../functions/runAutomod");
const utils_1 = require("../../../utils");
const CountersPlugin_1 = require("../../Counters/CountersPlugin");
async function runAutomodOnCounterTrigger(pluginData, counterName, triggerName, channelId, userId, reverse) {
    const user = userId ? await utils_1.resolveUser(pluginData.client, userId) : undefined;
    const member = (userId && (await utils_1.resolveMember(pluginData.client, pluginData.guild, userId))) || undefined;
    const prettyCounterName = pluginData.getPlugin(CountersPlugin_1.CountersPlugin).getPrettyNameForCounter(counterName);
    const prettyTriggerName = pluginData
        .getPlugin(CountersPlugin_1.CountersPlugin)
        .getPrettyNameForCounterTrigger(counterName, triggerName);
    const context = {
        timestamp: Date.now(),
        counterTrigger: {
            counter: counterName,
            trigger: triggerName,
            prettyCounter: prettyCounterName,
            prettyTrigger: prettyTriggerName,
            channelId,
            userId,
            reverse,
        },
        user: user instanceof utils_1.UnknownUser ? undefined : user,
        member,
    };
    pluginData.state.queue.add(async () => {
        await runAutomod_1.runAutomod(pluginData, context);
    });
}
exports.runAutomodOnCounterTrigger = runAutomodOnCounterTrigger;
