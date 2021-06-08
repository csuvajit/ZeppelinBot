"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeFindRelevantAuditLogEntry = void 0;
const LogsPlugin_1 = require("../plugins/Logs/LogsPlugin");
const utils_1 = require("../utils");
const LogType_1 = require("../data/LogType");
/**
 * Wrapper for findRelevantAuditLogEntry() that handles permission errors gracefully.
 * Calling plugin must have LogsPlugin as a dependency (or be LogsPlugin itself).
 */
async function safeFindRelevantAuditLogEntry(pluginData, actionType, userId, attempts, attemptDelay) {
    try {
        return await utils_1.findRelevantAuditLogEntry(pluginData.guild, actionType, userId, attempts, attemptDelay);
    }
    catch (e) {
        if (utils_1.isDiscordRESTError(e) && e.code === 50013) {
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: "Missing permissions to read audit log",
            });
            return;
        }
        throw e;
    }
}
exports.safeFindRelevantAuditLogEntry = safeFindRelevantAuditLogEntry;
