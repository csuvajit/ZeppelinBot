"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsGuildMemberUpdateEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const eris_1 = require("eris");
const LogType_1 = require("../../../data/LogType");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const lodash_difference_1 = __importDefault(require("lodash.difference"));
const safeFindRelevantAuditLogEntry_1 = require("../../../utils/safeFindRelevantAuditLogEntry");
exports.LogsGuildMemberUpdateEvt = types_1.logsEvt({
    event: "guildMemberUpdate",
    async listener(meta) {
        const pluginData = meta.pluginData;
        const oldMember = meta.args.oldMember;
        const member = meta.args.member;
        if (!oldMember)
            return;
        const logMember = utils_1.stripObjectToScalars(member, ["user", "roles"]);
        if (member.nick !== oldMember.nick) {
            pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_NICK_CHANGE, {
                member: logMember,
                oldNick: oldMember.nick != null ? oldMember.nick : "<none>",
                newNick: member.nick != null ? member.nick : "<none>",
            });
        }
        if (!lodash_isequal_1.default(oldMember.roles, member.roles)) {
            const addedRoles = lodash_difference_1.default(member.roles, oldMember.roles);
            const removedRoles = lodash_difference_1.default(oldMember.roles, member.roles);
            let skip = false;
            if (addedRoles.length &&
                removedRoles.length &&
                pluginData.state.guildLogs.isLogIgnored(LogType_1.LogType.MEMBER_ROLE_CHANGES, member.id)) {
                skip = true;
            }
            else if (addedRoles.length && pluginData.state.guildLogs.isLogIgnored(LogType_1.LogType.MEMBER_ROLE_ADD, member.id)) {
                skip = true;
            }
            else if (removedRoles.length &&
                pluginData.state.guildLogs.isLogIgnored(LogType_1.LogType.MEMBER_ROLE_REMOVE, member.id)) {
                skip = true;
            }
            if (!skip) {
                const relevantAuditLogEntry = await safeFindRelevantAuditLogEntry_1.safeFindRelevantAuditLogEntry(pluginData, eris_1.Constants.AuditLogActions.MEMBER_ROLE_UPDATE, member.id);
                const mod = relevantAuditLogEntry ? relevantAuditLogEntry.user : new utils_1.UnknownUser();
                if (addedRoles.length && removedRoles.length) {
                    // Roles added *and* removed
                    pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_ROLE_CHANGES, {
                        member: logMember,
                        addedRoles: addedRoles
                            .map(roleId => pluginData.guild.roles.get(roleId) || { id: roleId, name: `Unknown (${roleId})` })
                            .map(r => r.name)
                            .join(", "),
                        removedRoles: removedRoles
                            .map(roleId => pluginData.guild.roles.get(roleId) || { id: roleId, name: `Unknown (${roleId})` })
                            .map(r => r.name)
                            .join(", "),
                        mod: utils_1.stripObjectToScalars(mod),
                    }, member.id);
                }
                else if (addedRoles.length) {
                    // Roles added
                    pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_ROLE_ADD, {
                        member: logMember,
                        roles: addedRoles
                            .map(roleId => pluginData.guild.roles.get(roleId) || { id: roleId, name: `Unknown (${roleId})` })
                            .map(r => r.name)
                            .join(", "),
                        mod: utils_1.stripObjectToScalars(mod),
                    }, member.id);
                }
                else if (removedRoles.length && !addedRoles.length) {
                    // Roles removed
                    pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_ROLE_REMOVE, {
                        member: logMember,
                        roles: removedRoles
                            .map(roleId => pluginData.guild.roles.get(roleId) || { id: roleId, name: `Unknown (${roleId})` })
                            .map(r => r.name)
                            .join(", "),
                        mod: utils_1.stripObjectToScalars(mod),
                    }, member.id);
                }
            }
        }
    },
});
// TODO: Reimplement USERNAME_CHANGE
