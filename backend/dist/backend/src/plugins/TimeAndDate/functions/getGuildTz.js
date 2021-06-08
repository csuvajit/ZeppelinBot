"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuildTz = void 0;
function getGuildTz(pluginData) {
    return pluginData.config.get().timezone;
}
exports.getGuildTz = getGuildTz;
