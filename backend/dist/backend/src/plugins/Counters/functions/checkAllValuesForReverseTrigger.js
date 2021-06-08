"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllValuesForReverseTrigger = void 0;
const emitCounterEvent_1 = require("./emitCounterEvent");
async function checkAllValuesForReverseTrigger(pluginData, counterName, counterTrigger) {
    const triggeredContexts = await pluginData.state.counters.checkAllValuesForReverseTrigger(counterTrigger);
    for (const context of triggeredContexts) {
        emitCounterEvent_1.emitCounterEvent(pluginData, "reverseTrigger", counterName, counterTrigger.name, context.channelId, context.userId);
    }
}
exports.checkAllValuesForReverseTrigger = checkAllValuesForReverseTrigger;
