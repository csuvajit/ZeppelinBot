"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrettyNameForCounterTrigger = void 0;
function getPrettyNameForCounterTrigger(pluginData, counterName, triggerName) {
    const config = pluginData.config.get();
    const counter = config.counters[counterName];
    if (!counter) {
        return "Unknown Counter Trigger";
    }
    const trigger = counter.triggers[triggerName];
    return trigger ? trigger.pretty_name || trigger.name : "Unknown Counter Trigger";
}
exports.getPrettyNameForCounterTrigger = getPrettyNameForCounterTrigger;
