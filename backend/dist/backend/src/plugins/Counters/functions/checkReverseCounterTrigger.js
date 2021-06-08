"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReverseCounterTrigger = void 0;
const emitCounterEvent_1 = require("./emitCounterEvent");
async function checkReverseCounterTrigger(pluginData, counterName, counterTrigger, channelId, userId) {
    const triggered = await pluginData.state.counters.checkForReverseTrigger(counterTrigger, channelId, userId);
    if (triggered) {
        await emitCounterEvent_1.emitCounterEvent(pluginData, "reverseTrigger", counterName, counterTrigger.name, channelId, userId);
    }
}
exports.checkReverseCounterTrigger = checkReverseCounterTrigger;
