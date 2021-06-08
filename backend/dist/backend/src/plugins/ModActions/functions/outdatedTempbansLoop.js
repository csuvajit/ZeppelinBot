"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outdatedTempbansLoop = void 0;
const utils_1 = require("../../../utils");
const types_1 = require("../types");
const LogType_1 = require("src/data/LogType");
const formatReasonWithAttachments_1 = require("./formatReasonWithAttachments");
const ignoreEvent_1 = require("./ignoreEvent");
const isBanned_1 = require("./isBanned");
const logger_1 = require("src/logger");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const TEMPBAN_LOOP_TIME = 60 * utils_1.SECONDS;
async function outdatedTempbansLoop(pluginData) {
    const outdatedTempbans = await pluginData.state.tempbans.getExpiredTempbans();
    for (const tempban of outdatedTempbans) {
        if (!(await isBanned_1.isBanned(pluginData, tempban.user_id))) {
            pluginData.state.tempbans.clear(tempban.user_id);
            continue;
        }
        pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_UNBAN, tempban.user_id);
        const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(`Tempban timed out.
      Tempbanned at: \`${tempban.created_at} UTC\``, []);
        try {
            ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Unban, tempban.user_id);
            await pluginData.guild.unbanMember(tempban.user_id, reason != null ? encodeURIComponent(reason) : undefined);
        }
        catch (e) {
            pluginData.state.serverLogs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Encountered an error trying to automatically unban ${tempban.user_id} after tempban timeout`,
            });
            logger_1.logger.warn(`Error automatically unbanning ${tempban.user_id} (tempban timeout): ${e}`);
            return;
        }
        // Create case and delete tempban
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const createdCase = await casesPlugin.createCase({
            userId: tempban.user_id,
            modId: tempban.mod_id,
            type: CaseTypes_1.CaseTypes.Unban,
            reason,
            ppId: undefined,
        });
        pluginData.state.tempbans.clear(tempban.user_id);
        // Log the unban
        const banTime = moment_timezone_1.default(tempban.created_at).diff(moment_timezone_1.default(tempban.expires_at));
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_TIMED_UNBAN, {
            mod: utils_1.stripObjectToScalars(await utils_1.resolveUser(pluginData.client, tempban.mod_id)),
            userId: tempban.user_id,
            caseNumber: createdCase.case_number,
            reason,
            banTime: humanize_duration_1.default(banTime),
        });
    }
    if (!pluginData.state.unloaded) {
        pluginData.state.outdatedTempbansTimeout = setTimeout(() => outdatedTempbansLoop(pluginData), TEMPBAN_LOOP_TIME);
    }
}
exports.outdatedTempbansLoop = outdatedTempbansLoop;
