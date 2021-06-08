"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSpamArchives = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const pluginUtils_1 = require("../../../pluginUtils");
const SPAM_ARCHIVE_EXPIRY_DAYS = 90;
async function saveSpamArchives(pluginData, savedMessages) {
    const expiresAt = moment_timezone_1.default.utc().add(SPAM_ARCHIVE_EXPIRY_DAYS, "days");
    const archiveId = await pluginData.state.archives.createFromSavedMessages(savedMessages, pluginData.guild, expiresAt);
    return pluginData.state.archives.getUrl(pluginUtils_1.getBaseUrl(pluginData), archiveId);
}
exports.saveSpamArchives = saveSpamArchives;
