"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllValuesForTrigger = void 0;
const emitCounterEvent_1 = require("./emitCounterEvent");
async function checkAllValuesForTrigger(pluginData, counterName, counterTrigger) {
    const triggeredContexts = await pluginData.state.counters.checkAllValuesForTrigger(counterTrigger);
    for (const context of triggeredContexts) {
        emitCounterEvent_1.emitCounterEvent(pluginData, "trigger", counterName, counterTrigger.name, context.channelId, context.userId);
    }
}
exports.checkAllValuesForTrigger = checkAllValuesForTrigger;
