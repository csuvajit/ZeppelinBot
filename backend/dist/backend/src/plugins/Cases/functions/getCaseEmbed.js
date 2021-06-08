"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseEmbed = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const CaseTypes_1 = require("../../../data/CaseTypes");
const resolveCaseId_1 = require("./resolveCaseId");
const utils_1 = require("../../../utils");
const getCaseColor_1 = require("./getCaseColor");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
async function getCaseEmbed(pluginData, caseOrCaseId, requestMemberId, noOriginalCaseLink) {
    const theCase = await pluginData.state.cases.with("notes").find(resolveCaseId_1.resolveCaseId(caseOrCaseId));
    if (!theCase) {
        throw new Error("Unknown case");
    }
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    const createdAt = moment_timezone_1.default.utc(theCase.created_at);
    const actionTypeStr = CaseTypes_1.CaseTypes[theCase.type].toUpperCase();
    let userName = theCase.user_name;
    if (theCase.user_id && theCase.user_id !== "0")
        userName += `\n<@!${theCase.user_id}>`;
    let modName = theCase.mod_name;
    if (theCase.mod_id)
        modName += `\n<@!${theCase.mod_id}>`;
    const createdAtWithTz = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
        : timeAndDate.inGuildTz(createdAt);
    const embed = {
        title: `${actionTypeStr} - Case #${theCase.case_number}`,
        footer: {
            text: `Case created on ${createdAtWithTz.format(timeAndDate.getDateFormat("pretty_datetime"))}`,
        },
        fields: [
            {
                name: "User",
                value: userName,
                inline: true,
            },
            {
                name: "Moderator",
                value: modName,
                inline: true,
            },
        ],
    };
    if (theCase.pp_id) {
        embed.fields[1].value += `\np.p. ${theCase.pp_name}\n<@!${theCase.pp_id}>`;
    }
    if (theCase.is_hidden) {
        embed.title += " (hidden)";
    }
    embed.color = getCaseColor_1.getCaseColor(pluginData, theCase.type);
    if (theCase.notes.length) {
        for (const note of theCase.notes) {
            const noteDate = moment_timezone_1.default.utc(note.created_at);
            let noteBody = note.body.trim();
            if (noteBody === "") {
                noteBody = utils_1.emptyEmbedValue;
            }
            const chunks = utils_1.chunkMessageLines(noteBody, 1014);
            for (let i = 0; i < chunks.length; i++) {
                if (i === 0) {
                    const noteDateWithTz = requestMemberId
                        ? await timeAndDate.inMemberTz(requestMemberId, noteDate)
                        : timeAndDate.inGuildTz(noteDate);
                    const prettyNoteDate = noteDateWithTz.format(timeAndDate.getDateFormat("pretty_datetime"));
                    embed.fields.push({
                        name: `${note.mod_name} at ${prettyNoteDate}:`,
                        value: chunks[i],
                    });
                }
                else {
                    embed.fields.push({
                        name: utils_1.emptyEmbedValue,
                        value: chunks[i],
                    });
                }
            }
        }
    }
    else {
        embed.fields.push({
            name: "!!! THIS CASE HAS NO NOTES !!!",
            value: "\u200B",
        });
    }
    if (theCase.log_message_id && noOriginalCaseLink !== false) {
        const [channelId, messageId] = theCase.log_message_id.split("-");
        const link = utils_1.messageLink(pluginData.guild.id, channelId, messageId);
        embed.fields.push({
            name: utils_1.emptyEmbedValue,
            value: `[Go to original case in case log channel](${link})`,
        });
    }
    return { embed };
}
exports.getCaseEmbed = getCaseEmbed;
