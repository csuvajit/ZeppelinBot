"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCounterTrigger = void 0;
const emitCounterEvent_1 = require("./emitCounterEvent");
async function checkCounterTrigger(pluginData, counterName, counterTrigger, channelId, userId) {
    const triggered = await pluginData.state.counters.checkForTrigger(counterTrigger, channelId, userId);
    if (triggered) {
        await emitCounterEvent_1.emitCounterEvent(pluginData, "trigger", counterName, counterTrigger.name, channelId, userId);
    }
}
exports.checkCounterTrigger = checkCounterTrigger;
