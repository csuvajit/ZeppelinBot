"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCounterEvent = void 0;
function onCounterEvent(pluginData, event, listener) {
    return pluginData.state.events.on(event, listener);
}
exports.onCounterEvent = onCounterEvent;
