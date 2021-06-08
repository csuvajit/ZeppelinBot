"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCase = void 0;
const CaseTypes_1 = require("../../../data/CaseTypes");
const LogType_1 = require("../../../data/LogType");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const pluginUtils_1 = require("../../../pluginUtils");
const formatReasonWithAttachments_1 = require("./formatReasonWithAttachments");
async function updateCase(pluginData, msg, args) {
    let theCase;
    if (args.caseNumber != null) {
        theCase = await pluginData.state.cases.findByCaseNumber(args.caseNumber);
    }
    else {
        theCase = await pluginData.state.cases.findLatestByModId(msg.author.id);
    }
    if (!theCase) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Case not found");
        return;
    }
    if (!args.note && msg.attachments.length === 0) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Text or attachment required");
        return;
    }
    const note = formatReasonWithAttachments_1.formatReasonWithAttachments(args.note, msg.attachments);
    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
    await casesPlugin.createCaseNote({
        caseId: theCase.id,
        modId: msg.author.id,
        body: note,
    });
    pluginData.state.serverLogs.log(LogType_1.LogType.CASE_UPDATE, {
        mod: msg.author,
        caseNumber: theCase.case_number,
        caseType: CaseTypes_1.CaseTypes[theCase.type],
        note,
    });
    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Case \`#${theCase.case_number}\` updated`);
}
exports.updateCase = updateCase;
