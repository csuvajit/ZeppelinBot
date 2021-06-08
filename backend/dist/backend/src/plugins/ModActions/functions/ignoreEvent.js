"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreEvent = void 0;
const utils_1 = require("../../../utils");
const clearIgnoredEvents_1 = require("./clearIgnoredEvents");
const DEFAULT_TIMEOUT = 15 * utils_1.SECONDS;
function ignoreEvent(pluginData, type, userId, timeout = DEFAULT_TIMEOUT) {
    pluginData.state.ignoredEvents.push({ type, userId });
    // Clear after expiry (15sec by default)
    setTimeout(() => {
        clearIgnoredEvents_1.clearIgnoredEvents(pluginData, type, userId);
    }, timeout);
}
exports.ignoreEvent = ignoreEvent;
