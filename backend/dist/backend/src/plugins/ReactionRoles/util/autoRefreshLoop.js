"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoRefreshLoop = void 0;
const runAutoRefresh_1 = require("./runAutoRefresh");
async function autoRefreshLoop(pluginData, interval) {
    pluginData.state.autoRefreshTimeout = setTimeout(async () => {
        await runAutoRefresh_1.runAutoRefresh(pluginData);
        autoRefreshLoop(pluginData, interval);
    }, interval);
}
exports.autoRefreshLoop = autoRefreshLoop;
