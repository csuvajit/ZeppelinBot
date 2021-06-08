"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsGuildBanRemoveEvt = exports.LogsGuildBanAddEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const eris_1 = require("eris");
const safeFindRelevantAuditLogEntry_1 = require("../../../utils/safeFindRelevantAuditLogEntry");
exports.LogsGuildBanAddEvt = types_1.logsEvt({
    event: "guildBanAdd",
    async listener(meta) {
        const pluginData = meta.pluginData;
        const user = meta.args.user;
        const relevantAuditLogEntry = await safeFindRelevantAuditLogEntry_1.safeFindRelevantAuditLogEntry(pluginData, eris_1.Constants.AuditLogActions.MEMBER_BAN_ADD, user.id);
        const mod = relevantAuditLogEntry ? relevantAuditLogEntry.user : new utils_1.UnknownUser();
        pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_BAN, {
            mod: utils_1.stripObjectToScalars(mod),
            user: utils_1.stripObjectToScalars(user),
        }, user.id);
    },
});
exports.LogsGuildBanRemoveEvt = types_1.logsEvt({
    event: "guildBanRemove",
    async listener(meta) {
        const pluginData = meta.pluginData;
        const user = meta.args.user;
        const relevantAuditLogEntry = await safeFindRelevantAuditLogEntry_1.safeFindRelevantAuditLogEntry(pluginData, eris_1.Constants.AuditLogActions.MEMBER_BAN_REMOVE, user.id);
        const mod = relevantAuditLogEntry ? relevantAuditLogEntry.user : new utils_1.UnknownUser();
        pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_UNBAN, {
            mod: utils_1.stripObjectToScalars(mod),
            userId: user.id,
        }, user.id);
    },
});
