"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEventListenersFromMap = void 0;
function registerEventListenersFromMap(eventEmitter, map) {
    for (const [event, listener] of map.entries()) {
        eventEmitter.on(event, listener);
    }
}
exports.registerEventListenersFromMap = registerEventListenersFromMap;
