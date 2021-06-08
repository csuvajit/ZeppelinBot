"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBanCaseOnManualBanEvt = void 0;
const types_1 = require("../types");
const isEventIgnored_1 = require("../functions/isEventIgnored");
const clearIgnoredEvents_1 = require("../functions/clearIgnoredEvents");
const eris_1 = require("eris");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const safeFindRelevantAuditLogEntry_1 = require("../../../utils/safeFindRelevantAuditLogEntry");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
/**
 * Create a BAN case automatically when a user is banned manually.
 * Attempts to find the ban's details in the audit log.
 */
exports.CreateBanCaseOnManualBanEvt = types_1.modActionsEvt({
    event: "guildBanAdd",
    async listener({ pluginData, args: { guild, user } }) {
        if (isEventIgnored_1.isEventIgnored(pluginData, types_1.IgnoredEventType.Ban, user.id)) {
            clearIgnoredEvents_1.clearIgnoredEvents(pluginData, types_1.IgnoredEventType.Ban, user.id);
            return;
        }
        const relevantAuditLogEntry = await safeFindRelevantAuditLogEntry_1.safeFindRelevantAuditLogEntry(pluginData, eris_1.Constants.AuditLogActions.MEMBER_BAN_ADD, user.id);
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        let createdCase = null;
        let mod = null;
        let reason = "";
        if (relevantAuditLogEntry) {
            const modId = relevantAuditLogEntry.user.id;
            const auditLogId = relevantAuditLogEntry.id;
            mod = await utils_1.resolveUser(pluginData.client, modId);
            const config = mod instanceof utils_1.UnknownUser ? pluginData.config.get() : await pluginData.config.getForUser(mod);
            if (config.create_cases_for_manual_actions) {
                reason = relevantAuditLogEntry.reason || "";
                createdCase = await casesPlugin.createCase({
                    userId: user.id,
                    modId,
                    type: CaseTypes_1.CaseTypes.Ban,
                    auditLogId,
                    reason: reason || undefined,
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
                    type: CaseTypes_1.CaseTypes.Ban,
                });
            }
        }
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_BAN, {
            mod: mod ? utils_1.stripObjectToScalars(mod, ["user"]) : null,
            user: utils_1.stripObjectToScalars(user, ["user"]),
            caseNumber: createdCase?.case_number ?? 0,
            reason,
        });
        pluginData.state.events.emit("ban", user.id, reason);
    },
});
