"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decayCounter = void 0;
const checkAllValuesForTrigger_1 = require("./checkAllValuesForTrigger");
const checkAllValuesForReverseTrigger_1 = require("./checkAllValuesForReverseTrigger");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
async function decayCounter(pluginData, counterName, decayPeriodMS, decayAmount) {
    const config = pluginData.config.get();
    const counter = config.counters[counterName];
    if (!counter) {
        throw new Error(`Unknown counter: ${counterName}`);
    }
    const counterId = pluginData.state.counterIds[counterName];
    const lock = await pluginData.locks.acquire(lockNameHelpers_1.counterIdLock(counterId));
    await pluginData.state.counters.decay(counterId, decayPeriodMS, decayAmount);
    // Check for trigger matches, if any, when the counter value changes
    const triggers = pluginData.state.counterTriggersByCounterId.get(counterId);
    if (triggers) {
        const triggersArr = Array.from(triggers.values());
        await Promise.all(triggersArr.map(trigger => checkAllValuesForTrigger_1.checkAllValuesForTrigger(pluginData, counterName, trigger)));
        await Promise.all(triggersArr.map(trigger => checkAllValuesForReverseTrigger_1.checkAllValuesForReverseTrigger(pluginData, counterName, trigger)));
    }
    lock.unlock();
}
exports.decayCounter = decayCounter;
