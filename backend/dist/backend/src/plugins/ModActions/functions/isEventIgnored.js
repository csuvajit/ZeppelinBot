"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEventIgnored = void 0;
function isEventIgnored(pluginData, type, userId) {
    return pluginData.state.ignoredEvents.some(info => type === info.type && userId === info.userId);
}
exports.isEventIgnored = isEventIgnored;
