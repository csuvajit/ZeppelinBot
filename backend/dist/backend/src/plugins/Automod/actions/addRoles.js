"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRolesAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const eris_1 = require("eris");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const getMissingPermissions_1 = require("../../../utils/getMissingPermissions");
const canAssignRole_1 = require("../../../utils/canAssignRole");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
const ignoredRoleChanges_1 = require("../functions/ignoredRoleChanges");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
const p = eris_1.Constants.Permissions;
exports.AddRolesAction = helpers_1.automodAction({
    configType: t.array(t.string),
    defaultConfig: [],
    async apply({ pluginData, contexts, actionConfig, ruleName }) {
        const members = utils_1.unique(contexts.map(c => c.member).filter(utils_1.nonNullish));
        const me = pluginData.guild.members.get(pluginData.client.user.id);
        const missingPermissions = getMissingPermissions_1.getMissingPermissions(me.permission, p.manageRoles);
        if (missingPermissions) {
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Cannot add roles in Automod rule **${ruleName}**. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`,
            });
            return;
        }
        const rolesToAssign = [];
        const rolesWeCannotAssign = [];
        for (const roleId of actionConfig) {
            if (canAssignRole_1.canAssignRole(pluginData.guild, me, roleId)) {
                rolesToAssign.push(roleId);
            }
            else {
                rolesWeCannotAssign.push(roleId);
            }
        }
        if (rolesWeCannotAssign.length) {
            const roleNamesWeCannotAssign = rolesWeCannotAssign.map(roleId => pluginData.guild.roles.get(roleId)?.name || roleId);
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Unable to assign the following roles in Automod rule **${ruleName}**: **${roleNamesWeCannotAssign.join("**, **")}**`,
            });
        }
        await Promise.all(members.map(async (member) => {
            const memberRoles = new Set(member.roles);
            for (const roleId of rolesToAssign) {
                memberRoles.add(roleId);
                ignoredRoleChanges_1.ignoreRoleChange(pluginData, member.id, roleId);
            }
            if (memberRoles.size === member.roles.length) {
                // No role changes
                return;
            }
            const memberRoleLock = await pluginData.locks.acquire(lockNameHelpers_1.memberRolesLock(member));
            const rolesArr = Array.from(memberRoles.values());
            await member.edit({
                roles: rolesArr,
            });
            member.roles = rolesArr; // Make sure we know of the new roles internally as well
            memberRoleLock.unlock();
        }));
    },
});
