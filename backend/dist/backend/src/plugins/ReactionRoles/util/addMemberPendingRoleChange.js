"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberPendingRoleChange = void 0;
const utils_1 = require("../../../utils");
const logger_1 = require("../../../logger");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
const ROLE_CHANGE_BATCH_DEBOUNCE_TIME = 1500;
async function addMemberPendingRoleChange(pluginData, memberId, mode, roleId) {
    if (!pluginData.state.pendingRoleChanges.has(memberId)) {
        const newPendingRoleChangeObj = {
            timeout: null,
            changes: [],
            applyFn: async () => {
                pluginData.state.pendingRoleChanges.delete(memberId);
                const lock = await pluginData.locks.acquire(lockNameHelpers_1.memberRolesLock({ id: memberId }));
                const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, memberId);
                if (member) {
                    const newRoleIds = new Set(member.roles);
                    for (const change of newPendingRoleChangeObj.changes) {
                        if (change.mode === "+")
                            newRoleIds.add(change.roleId);
                        else
                            newRoleIds.delete(change.roleId);
                    }
                    try {
                        await member.edit({
                            roles: Array.from(newRoleIds.values()),
                        }, "Reaction roles");
                    }
                    catch (e) {
                        logger_1.logger.warn(`Failed to apply role changes to ${member.username}#${member.discriminator} (${member.id}): ${e.message}`);
                    }
                }
                lock.unlock();
            },
        };
        pluginData.state.pendingRoleChanges.set(memberId, newPendingRoleChangeObj);
    }
    const pendingRoleChangeObj = pluginData.state.pendingRoleChanges.get(memberId);
    pendingRoleChangeObj.changes.push({ mode, roleId });
    if (pendingRoleChangeObj.timeout)
        clearTimeout(pendingRoleChangeObj.timeout);
    pendingRoleChangeObj.timeout = setTimeout(() => pluginData.state.roleChangeQueue.add(pendingRoleChangeObj.applyFn), ROLE_CHANGE_BATCH_DEBOUNCE_TIME);
}
exports.addMemberPendingRoleChange = addMemberPendingRoleChange;
