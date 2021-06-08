"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUnbanCaseOnManualUnbanEvt = void 0;
const types_1 = require("../types");
const isEventIgnored_1 = require("../functions/isEventIgnored");
const clearIgnoredEvents_1 = require("../functions/clearIgnoredEvents");
const eris_1 = require("eris");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const safeFindRelevantAuditLogEntry_1 = require("../../../utils/safeFindRelevantAuditLogEntry");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
/**
 * Create an UNBAN case automatically when a user is unbanned manually.
 * Attempts to find the unban's details in the audit log.
 */
exports.CreateUnbanCaseOnManualUnbanEvt = types_1.modActionsEvt({
    event: "guildBanRemove",
    async listener({ pluginData, args: { guild, user } }) {
        if (isEventIgnored_1.isEventIgnored(pluginData, types_1.IgnoredEventType.Unban, user.id)) {
            clearIgnoredEvents_1.clearIgnoredEvents(pluginData, types_1.IgnoredEventType.Unban, user.id);
            return;
        }
        const relevantAuditLogEntry = await safeFindRelevantAuditLogEntry_1.safeFindRelevantAuditLogEntry(pluginData, eris_1.Constants.AuditLogActions.MEMBER_BAN_REMOVE, user.id);
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        let createdCase = null;
        let mod = null;
        if (relevantAuditLogEntry) {
            const modId = relevantAuditLogEntry.user.id;
            const auditLogId = relevantAuditLogEntry.id;
            mod = await utils_1.resolveUser(pluginData.client, modId);
            const config = mod instanceof utils_1.UnknownUser ? pluginData.config.get() : await pluginData.config.getForUser(mod);
            if (config.create_cases_for_manual_actions) {
                createdCase = await casesPlugin.createCase({
                    userId: user.id,
                    modId,
                    type: CaseTypes_1.CaseTypes.Unban,
                    auditLogId,
                    automatic: true,
                });
            }
        }
        else {
            const config = pluginData.config.get();
            if (config.create_cases_for_manual_actions) {
                createdCase = await casesPlugin.createCase({
                    userId: user.id,
                    modId: "0",
                    type: CaseTypes_1.CaseTypes.Unban,
                    automatic: true,
                });
            }
        }
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_UNBAN, {
            mod: mod ? utils_1.stripObjectToScalars(mod, ["user"]) : null,
            userId: user.id,
            caseNumber: createdCase?.case_number ?? 0,
        });
        pluginData.state.events.emit("unban", user.id);
    },
});
