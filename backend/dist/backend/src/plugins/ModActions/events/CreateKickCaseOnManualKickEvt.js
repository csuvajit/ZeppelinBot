"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateKickCaseOnManualKickEvt = void 0;
const types_1 = require("../types");
const isEventIgnored_1 = require("../functions/isEventIgnored");
const clearIgnoredEvents_1 = require("../functions/clearIgnoredEvents");
const eris_1 = require("eris");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const logger_1 = require("../../../logger");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const safeFindRelevantAuditLogEntry_1 = require("../../../utils/safeFindRelevantAuditLogEntry");
/**
 * Create a KICK case automatically when a user is kicked manually.
 * Attempts to find the kick's details in the audit log.
 */
exports.CreateKickCaseOnManualKickEvt = types_1.modActionsEvt({
    event: "guildMemberRemove",
    async listener({ pluginData, args: { member } }) {
        if (isEventIgnored_1.isEventIgnored(pluginData, types_1.IgnoredEventType.Kick, member.id)) {
            clearIgnoredEvents_1.clearIgnoredEvents(pluginData, types_1.IgnoredEventType.Kick, member.id);
            return;
        }
        const kickAuditLogEntry = await safeFindRelevantAuditLogEntry_1.safeFindRelevantAuditLogEntry(pluginData, eris_1.Constants.AuditLogActions.MEMBER_KICK, member.id);
        let mod = null;
        let createdCase = null;
        // Since a member leaving and a member being kicked are both the same gateway event,
        // we can only really interpret this event as a kick if there is a matching audit log entry.
        if (kickAuditLogEntry) {
            createdCase = (await pluginData.state.cases.findByAuditLogId(kickAuditLogEntry.id)) || null;
            if (createdCase) {
                logger_1.logger.warn(`Tried to create duplicate case for audit log entry ${kickAuditLogEntry.id}, existing case id ${createdCase.id}`);
            }
            else {
                mod = await utils_1.resolveUser(pluginData.client, kickAuditLogEntry.user.id);
                const config = mod instanceof utils_1.UnknownUser ? pluginData.config.get() : await pluginData.config.getForUser(mod);
                if (config.create_cases_for_manual_actions) {
                    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
                    createdCase = await casesPlugin.createCase({
                        userId: member.id,
                        modId: kickAuditLogEntry.user.id,
                        type: CaseTypes_1.CaseTypes.Kick,
                        auditLogId: kickAuditLogEntry.id,
                        reason: kickAuditLogEntry.reason || undefined,
                        automatic: true,
                    });
                }
            }
            pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_KICK, {
                user: utils_1.stripObjectToScalars(member.user),
                mod: mod ? utils_1.stripObjectToScalars(mod) : null,
                caseNumber: createdCase?.case_number ?? 0,
                reason: kickAuditLogEntry.reason || "",
            });
            pluginData.state.events.emit("kick", member.id, kickAuditLogEntry.reason || undefined);
        }
    },
});
