"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offModActionsEvent = void 0;
function offModActionsEvent(pluginData, event, listener) {
    return pluginData.state.events.off(event, listener);
}
exports.offModActionsEvent = offModActionsEvent;
