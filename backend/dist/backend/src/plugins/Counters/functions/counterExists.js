"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counterExists = void 0;
function counterExists(pluginData, counterName) {
    const config = pluginData.config.get();
    return config.counters[counterName] != null;
}
exports.counterExists = counterExists;
