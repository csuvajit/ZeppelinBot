"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadDataEvt = void 0;
const types_1 = require("../types");
const eris_1 = require("eris");
const lodash_intersection_1 = __importDefault(require("lodash.intersection"));
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const getMissingPermissions_1 = require("../../../utils/getMissingPermissions");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
const canAssignRole_1 = require("../../../utils/canAssignRole");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
const p = eris_1.Constants.Permissions;
exports.LoadDataEvt = types_1.persistEvt({
    event: "guildMemberAdd",
    async listener(meta) {
        const member = meta.args.member;
        const pluginData = meta.pluginData;
        const memberRoleLock = await pluginData.locks.acquire(lockNameHelpers_1.memberRolesLock(member));
        const persistedData = await pluginData.state.persistedData.find(member.id);
        if (!persistedData) {
            memberRoleLock.unlock();
            return;
        }
        const toRestore = {};
        const config = await pluginData.config.getForMember(member);
        const restoredData = [];
        // Check permissions
        const me = pluginData.guild.members.get(pluginData.client.user.id);
        let requiredPermissions = 0n;
        if (config.persist_nicknames)
            requiredPermissions |= p.manageNicknames;
        if (config.persisted_roles)
            requiredPermissions |= p.manageRoles;
        const missingPermissions = getMissingPermissions_1.getMissingPermissions(me.permission, requiredPermissions);
        if (missingPermissions) {
            pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.BOT_ALERT, {
                body: `Missing permissions for persist plugin: ${missingPermissionError_1.missingPermissionError(missingPermissions)}`,
            });
            return;
        }
        // Check specific role permissions
        if (config.persisted_roles) {
            for (const roleId of config.persisted_roles) {
                if (!canAssignRole_1.canAssignRole(pluginData.guild, me, roleId)) {
                    pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.BOT_ALERT, {
                        body: `Missing permissions to assign role \`${roleId}\` in persist plugin`,
                    });
                    return;
                }
            }
        }
        const persistedRoles = config.persisted_roles;
        if (persistedRoles.length) {
            const rolesToRestore = lodash_intersection_1.default(persistedRoles, persistedData.roles);
            if (rolesToRestore.length) {
                restoredData.push("roles");
                toRestore.roles = Array.from(new Set([...rolesToRestore, ...member.roles]));
            }
        }
        if (config.persist_nicknames && persistedData.nickname) {
            restoredData.push("nickname");
            toRestore.nick = persistedData.nickname;
        }
        if (restoredData.length) {
            await member.edit(toRestore, "Restored upon rejoin");
            await pluginData.state.persistedData.clear(member.id);
            pluginData.state.logs.log(LogType_1.LogType.MEMBER_RESTORE, {
                member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
                restoredData: restoredData.join(", "),
            });
        }
        memberRoleLock.unlock();
    },
});
