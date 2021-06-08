"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitCounterEvent = void 0;
function emitCounterEvent(pluginData, event, ...rest) {
    return pluginData.state.events.emit(event, ...rest);
}
exports.emitCounterEvent = emitCounterEvent;
