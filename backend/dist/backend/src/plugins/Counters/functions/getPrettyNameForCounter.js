"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrettyNameForCounter = void 0;
function getPrettyNameForCounter(pluginData, counterName) {
    const config = pluginData.config.get();
    const counter = config.counters[counterName];
    return counter ? counter.pretty_name || counter.name : "Unknown Counter";
}
exports.getPrettyNameForCounter = getPrettyNameForCounter;
