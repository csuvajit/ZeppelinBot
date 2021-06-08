"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateFormat = void 0;
const defaultDateFormats_1 = require("../defaultDateFormats");
function getDateFormat(pluginData, formatName) {
    return pluginData.config.get().date_formats?.[formatName] || defaultDateFormats_1.defaultDateFormats[formatName];
}
exports.getDateFormat = getDateFormat;
