"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAllCounterValues = void 0;
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
async function resetAllCounterValues(pluginData, counterName) {
    const config = pluginData.config.get();
    const counter = config.counters[counterName];
    if (!counter) {
        throw new Error(`Unknown counter: ${counterName}`);
    }
    const counterId = pluginData.state.counterIds[counterName];
    const lock = await pluginData.locks.acquire(lockNameHelpers_1.counterIdLock(counterId));
    await pluginData.state.counters.resetAllCounterValues(counterId);
    lock.unlock();
}
exports.resetAllCounterValues = resetAllCounterValues;
