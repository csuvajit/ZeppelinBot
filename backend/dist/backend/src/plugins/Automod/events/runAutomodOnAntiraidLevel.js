"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutomodOnAntiraidLevel = void 0;
const runAutomod_1 = require("../functions/runAutomod");
async function runAutomodOnAntiraidLevel(pluginData, level, user) {
    const context = {
        timestamp: Date.now(),
        antiraid: {
            level,
        },
        user,
    };
    pluginData.state.queue.add(async () => {
        await runAutomod_1.runAutomod(pluginData, context);
    });
}
exports.runAutomodOnAntiraidLevel = runAutomodOnAntiraidLevel;
