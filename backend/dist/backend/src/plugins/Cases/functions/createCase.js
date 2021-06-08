"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCase = void 0;
const utils_1 = require("../../../utils");
const createCaseNote_1 = require("./createCaseNote");
const postToCaseLogChannel_1 = require("./postToCaseLogChannel");
const logger_1 = require("../../../logger");
async function createCase(pluginData, args) {
    const user = await utils_1.resolveUser(pluginData.client, args.userId);
    const userName = `${user.username}#${user.discriminator}`;
    const mod = await utils_1.resolveUser(pluginData.client, args.modId);
    const modName = `${mod.username}#${mod.discriminator}`;
    let ppName = null;
    if (args.ppId) {
        const pp = await utils_1.resolveUser(pluginData.client, args.ppId);
        ppName = `${pp.username}#${pp.discriminator}`;
    }
    if (args.auditLogId) {
        const existingAuditLogCase = await pluginData.state.cases.findByAuditLogId(args.auditLogId);
        if (existingAuditLogCase) {
            delete args.auditLogId;
            logger_1.logger.warn(`Duplicate audit log ID for mod case: ${args.auditLogId}`);
        }
    }
    const createdCase = await pluginData.state.cases.create({
        type: args.type,
        user_id: args.userId,
        user_name: userName,
        mod_id: args.modId,
        mod_name: modName,
        audit_log_id: args.auditLogId,
        pp_id: args.ppId,
        pp_name: ppName,
        is_hidden: Boolean(args.hide),
    });
    if (args.reason || (args.noteDetails && args.noteDetails.length)) {
        await createCaseNote_1.createCaseNote(pluginData, {
            caseId: createdCase.id,
            modId: args.modId,
            body: args.reason || "",
            automatic: args.automatic,
            postInCaseLogOverride: false,
            noteDetails: args.noteDetails,
        });
    }
    if (args.extraNotes) {
        for (const extraNote of args.extraNotes) {
            await createCaseNote_1.createCaseNote(pluginData, {
                caseId: createdCase.id,
                modId: args.modId,
                body: extraNote,
                automatic: args.automatic,
                postInCaseLogOverride: false,
            });
        }
    }
    const config = pluginData.config.get();
    const shouldPostToCaseLogChannel = args.postInCaseLogOverride === true ||
        ((!args.automatic || config.log_automatic_actions) && args.postInCaseLogOverride !== false);
    if (config.case_log_channel && shouldPostToCaseLogChannel) {
        await postToCaseLogChannel_1.postCaseToCaseLogChannel(pluginData, createdCase);
    }
    return createdCase;
}
exports.createCase = createCase;
