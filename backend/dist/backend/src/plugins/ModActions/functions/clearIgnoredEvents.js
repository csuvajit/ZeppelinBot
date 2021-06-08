"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearIgnoredEvents = void 0;
function clearIgnoredEvents(pluginData, type, userId) {
    pluginData.state.ignoredEvents.splice(pluginData.state.ignoredEvents.findIndex(info => type === info.type && userId === info.userId), 1);
}
exports.clearIgnoredEvents = clearIgnoredEvents;
