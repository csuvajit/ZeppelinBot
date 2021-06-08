"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCounterValue = void 0;
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
const checkCounterTrigger_1 = require("./checkCounterTrigger");
const checkReverseCounterTrigger_1 = require("./checkReverseCounterTrigger");
async function setCounterValue(pluginData, counterName, channelId, userId, value) {
    const config = pluginData.config.get();
    const counter = config.counters[counterName];
    if (!counter) {
        throw new Error(`Unknown counter: ${counterName}`);
    }
    if (counter.per_channel && !channelId) {
        throw new Error(`Counter is per channel but no channel ID was supplied`);
    }
    if (counter.per_user && !userId) {
        throw new Error(`Counter is per user but no user ID was supplied`);
    }
    const counterId = pluginData.state.counterIds[counterName];
    const lock = await pluginData.locks.acquire(lockNameHelpers_1.counterIdLock(counterId));
    await pluginData.state.counters.setCounterValue(counterId, channelId, userId, value);
    // Check for trigger matches, if any, when the counter value changes
    const triggers = pluginData.state.counterTriggersByCounterId.get(counterId);
    if (triggers) {
        const triggersArr = Array.from(triggers.values());
        await Promise.all(triggersArr.map(trigger => checkCounterTrigger_1.checkCounterTrigger(pluginData, counterName, trigger, channelId, userId)));
        await Promise.all(triggersArr.map(trigger => checkReverseCounterTrigger_1.checkReverseCounterTrigger(pluginData, counterName, trigger, channelId, userId)));
    }
    lock.unlock();
}
exports.setCounterValue = setCounterValue;
