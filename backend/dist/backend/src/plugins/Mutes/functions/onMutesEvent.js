"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMutesEvent = void 0;
function onMutesEvent(pluginData, event, listener) {
    return pluginData.state.events.on(event, listener);
}
exports.onMutesEvent = onMutesEvent;
