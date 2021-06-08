"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuildPrefix = void 0;
const commandUtils_1 = require("knub/dist/commands/commandUtils");
function getGuildPrefix(pluginData) {
    return pluginData.fullConfig.prefix || commandUtils_1.getDefaultPrefix(pluginData.client);
}
exports.getGuildPrefix = getGuildPrefix;
