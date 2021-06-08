"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAntiraidLevel = void 0;
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const runAutomodOnAntiraidLevel_1 = require("../events/runAutomodOnAntiraidLevel");
async function setAntiraidLevel(pluginData, newLevel, user) {
    pluginData.state.cachedAntiraidLevel = newLevel;
    await pluginData.state.antiraidLevels.set(newLevel);
    runAutomodOnAntiraidLevel_1.runAutomodOnAntiraidLevel(pluginData, newLevel, user);
    const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
    if (user) {
        logs.log(LogType_1.LogType.SET_ANTIRAID_USER, {
            level: newLevel ?? "off",
            user: utils_1.stripObjectToScalars(user),
        });
    }
    else {
        logs.log(LogType_1.LogType.SET_ANTIRAID_AUTO, {
            level: newLevel ?? "off",
        });
    }
}
exports.setAntiraidLevel = setAntiraidLevel;
