"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterEventListenersFromMap = void 0;
function unregisterEventListenersFromMap(eventEmitter, map) {
    for (const [event, listener] of map.entries()) {
        eventEmitter.off(event, listener);
    }
}
exports.unregisterEventListenersFromMap = unregisterEventListenersFromMap;
