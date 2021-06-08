"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onModActionsEvent = void 0;
function onModActionsEvent(pluginData, event, listener) {
    return pluginData.state.events.on(event, listener);
}
exports.onModActionsEvent = onModActionsEvent;
