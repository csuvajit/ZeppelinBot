"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCounterValue = void 0;
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
const checkCounterTrigger_1 = require("./checkCounterTrigger");
const checkReverseCounterTrigger_1 = require("./checkReverseCounterTrigger");
async function changeCounterValue(pluginData, counterName, channelId, userId, change) {
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
    channelId = counter.per_channel ? channelId : null;
    userId = counter.per_user ? userId : null;
    const counterId = pluginData.state.counterIds[counterName];
    const lock = await pluginData.locks.acquire(lockNameHelpers_1.counterIdLock(counterId));
    await pluginData.state.counters.changeCounterValue(counterId, channelId, userId, change, counter.initial_value);
    // Check for trigger matches, if any, when the counter value changes
    const triggers = pluginData.state.counterTriggersByCounterId.get(counterId);
    if (triggers) {
        const triggersArr = Array.from(triggers.values());
        await Promise.all(triggersArr.map(trigger => checkCounterTrigger_1.checkCounterTrigger(pluginData, counterName, trigger, channelId, userId)));
        await Promise.all(triggersArr.map(trigger => checkReverseCounterTrigger_1.checkReverseCounterTrigger(pluginData, counterName, trigger, channelId, userId)));
    }
    lock.unlock();
}
exports.changeCounterValue = changeCounterValue;
