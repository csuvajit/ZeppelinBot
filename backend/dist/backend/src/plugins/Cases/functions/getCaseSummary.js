"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseSummary = void 0;
const utils_1 = require("../../../utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Case_1 = require("../../../data/entities/Case");
const caseAbbreviations_1 = require("../caseAbbreviations");
const getCaseIcon_1 = require("./getCaseIcon");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const helpers_1 = require("knub/dist/helpers");
const CASE_SUMMARY_REASON_MAX_LENGTH = 300;
const INCLUDE_MORE_NOTES_THRESHOLD = 20;
const UPDATE_STR = "**[Update]**";
const RELATIVE_TIME_THRESHOLD = 7 * utils_1.DAYS;
async function getCaseSummary(pluginData, caseOrCaseId, withLinks = false, requestMemberId) {
    const config = pluginData.config.get();
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    const caseId = caseOrCaseId instanceof Case_1.Case ? caseOrCaseId.id : caseOrCaseId;
    const theCase = await pluginData.state.cases.with("notes").find(caseId);
    if (!theCase)
        return null;
    const firstNote = theCase.notes[0];
    let reason = firstNote ? firstNote.body : "";
    let leftoverNotes = Math.max(0, theCase.notes.length - 1);
    for (let i = 1; i < theCase.notes.length; i++) {
        if (reason.length >= CASE_SUMMARY_REASON_MAX_LENGTH - UPDATE_STR.length - INCLUDE_MORE_NOTES_THRESHOLD)
            break;
        reason += ` ${UPDATE_STR} ${theCase.notes[i].body}`;
        leftoverNotes--;
    }
    if (reason.length > CASE_SUMMARY_REASON_MAX_LENGTH) {
        const match = reason.slice(CASE_SUMMARY_REASON_MAX_LENGTH, 100).match(/(?:[.,!?\s]|$)/);
        const nextWhitespaceIndex = match ? CASE_SUMMARY_REASON_MAX_LENGTH + match.index : CASE_SUMMARY_REASON_MAX_LENGTH;
        const reasonChunks = helpers_1.splitMessageIntoChunks(reason, nextWhitespaceIndex);
        reason = reasonChunks[0] + "...";
    }
    reason = utils_1.disableLinkPreviews(reason);
    const timestamp = moment_timezone_1.default.utc(theCase.created_at, utils_1.DBDateFormat);
    const relativeTimeCutoff = utils_1.convertDelayStringToMS(config.relative_time_cutoff);
    const useRelativeTime = config.show_relative_times && Date.now() - timestamp.valueOf() < relativeTimeCutoff;
    const timestampWithTz = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, timestamp)
        : timeAndDate.inGuildTz(timestamp);
    const prettyTimestamp = useRelativeTime
        ? moment_timezone_1.default.utc().to(timestamp)
        : timestampWithTz.format(timeAndDate.getDateFormat("date"));
    const icon = getCaseIcon_1.getCaseIcon(pluginData, theCase.type);
    let caseTitle = `\`#${theCase.case_number}\``;
    if (withLinks && theCase.log_message_id) {
        const [channelId, messageId] = theCase.log_message_id.split("-");
        caseTitle = `[${caseTitle}](${utils_1.messageLink(pluginData.guild.id, channelId, messageId)})`;
    }
    else {
        caseTitle = `\`${caseTitle}\``;
    }
    let caseType = (caseAbbreviations_1.caseAbbreviations[theCase.type] || String(theCase.type)).toUpperCase();
    caseType = (caseType + "    ").slice(0, 4);
    let line = `${icon} **\`${caseType}\`** \`[${prettyTimestamp}]\` ${caseTitle} ${reason}`;
    if (leftoverNotes > 1) {
        line += ` *(+${leftoverNotes} ${leftoverNotes === 1 ? "note" : "notes"})*`;
    }
    if (theCase.is_hidden) {
        line += " *(hidden)*";
    }
    return line.trim();
}
exports.getCaseSummary = getCaseSummary;
