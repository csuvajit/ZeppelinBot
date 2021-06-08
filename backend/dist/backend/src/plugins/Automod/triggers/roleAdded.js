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
exports.RoleAddedTrigger = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const ignoredRoleChanges_1 = require("../functions/ignoredRoleChanges");
exports.RoleAddedTrigger = helpers_1.automodTrigger()({
    configType: t.union([t.string, t.array(t.string)]),
    defaultConfig: "",
    async match({ triggerConfig, context, pluginData }) {
        if (!context.member || !context.rolesChanged || context.rolesChanged.added.length === 0) {
            return;
        }
        const triggerRoles = Array.isArray(triggerConfig) ? triggerConfig : [triggerConfig];
        for (const roleId of triggerRoles) {
            if (context.rolesChanged.added.includes(roleId)) {
                if (ignoredRoleChanges_1.consumeIgnoredRoleChange(pluginData, context.member.id, roleId)) {
                    continue;
                }
                return {
                    extra: {
                        matchedRoleId: roleId,
                    },
                };
            }
        }
    },
    renderMatchInformation({ matchResult, pluginData, contexts }) {
        const role = pluginData.guild.roles.get(matchResult.extra.matchedRoleId);
        const roleName = role?.name || "Unknown";
        const member = contexts[0].member;
        const memberName = `**${member.user.username}#${member.user.discriminator}** (\`${member.id}\`)`;
        return `Role ${roleName} (\`${matchResult.extra.matchedRoleId}\`) was added to ${memberName}`;
    },
});
