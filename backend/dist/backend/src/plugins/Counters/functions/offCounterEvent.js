"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offCounterEvent = void 0;
function offCounterEvent(pluginData, ...rest) {
    return pluginData.state.events.off(...rest);
}
exports.offCounterEvent = offCounterEvent;
