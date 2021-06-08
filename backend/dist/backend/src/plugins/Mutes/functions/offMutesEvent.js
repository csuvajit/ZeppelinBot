"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offMutesEvent = void 0;
function offMutesEvent(pluginData, event, listener) {
    return pluginData.state.events.off(event, listener);
}
exports.offMutesEvent = offMutesEvent;
