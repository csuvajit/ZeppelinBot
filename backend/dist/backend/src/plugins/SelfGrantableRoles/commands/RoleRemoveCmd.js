"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRemoveCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const getApplyingEntries_1 = require("../util/getApplyingEntries");
const pluginUtils_1 = require("../../../pluginUtils");
const splitRoleNames_1 = require("../util/splitRoleNames");
const normalizeRoleNames_1 = require("../util/normalizeRoleNames");
const findMatchingRoles_1 = require("../util/findMatchingRoles");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
exports.RoleRemoveCmd = types_1.selfGrantableRolesCmd({
    trigger: "role remove",
    permission: null,
    signature: {
        roleNames: commandTypes_1.commandTypeHelpers.string({ rest: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const lock = await pluginData.locks.acquire(lockNameHelpers_1.memberRolesLock(msg.author));
        const applyingEntries = await getApplyingEntries_1.getApplyingEntries(pluginData, msg);
        if (applyingEntries.length === 0) {
            lock.unlock();
            return;
        }
        const roleNames = normalizeRoleNames_1.normalizeRoleNames(splitRoleNames_1.splitRoleNames(args.roleNames));
        const matchedRoleIds = findMatchingRoles_1.findMatchingRoles(roleNames, applyingEntries);
        const rolesToRemove = Array.from(matchedRoleIds.values()).map(id => pluginData.guild.roles.get(id));
        const roleIdsToRemove = rolesToRemove.map(r => r.id);
        // Remove the roles
        if (rolesToRemove.length) {
            const newRoleIds = msg.member.roles.filter(roleId => !roleIdsToRemove.includes(roleId));
            try {
                await msg.member.edit({
                    roles: newRoleIds,
                });
                const removedRolesStr = rolesToRemove.map(r => `**${r.name}**`);
                const removedRolesWord = rolesToRemove.length === 1 ? "role" : "roles";
                if (rolesToRemove.length !== roleNames.length) {
                    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `<@!${msg.author.id}> Removed ${removedRolesStr.join(", ")} ${removedRolesWord};` +
                        ` couldn't recognize the other roles you mentioned`);
                }
                else {
                    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `<@!${msg.author.id}> Removed ${removedRolesStr.join(", ")} ${removedRolesWord}`);
                }
            }
            catch {
                pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `<@!${msg.author.id}> Got an error while trying to remove the roles`);
            }
        }
        else {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `<@!${msg.author.id}> Unknown ${args.roleNames.length === 1 ? "role" : "roles"}`);
        }
        lock.unlock();
    },
});
