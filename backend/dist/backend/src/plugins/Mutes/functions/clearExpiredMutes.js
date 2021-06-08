"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearExpiredMutes = void 0;
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
async function clearExpiredMutes(pluginData) {
    const expiredMutes = await pluginData.state.mutes.getExpiredMutes();
    for (const mute of expiredMutes) {
        const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, mute.user_id);
        if (member) {
            try {
                const lock = await pluginData.locks.acquire(lockNameHelpers_1.memberRolesLock(member));
                const muteRole = pluginData.config.get().mute_role;
                if (muteRole) {
                    await member.removeRole(muteRole);
                    member.roles = member.roles.filter(r => r !== muteRole);
                }
                if (mute.roles_to_restore) {
                    const memberOptions = {};
                    const guildRoles = pluginData.guild.roles;
                    memberOptions.roles = Array.from(new Set([...mute.roles_to_restore, ...member.roles.filter(x => x !== muteRole && guildRoles.has(x))]));
                    await member.edit(memberOptions);
                    member.roles = memberOptions.roles;
                }
                lock.unlock();
            }
            catch {
                pluginData.state.serverLogs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Failed to remove mute role from {userMention(member)}`,
                    member: utils_1.stripObjectToScalars(member),
                });
            }
        }
        await pluginData.state.mutes.clear(mute.user_id);
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_MUTE_EXPIRED, {
            member: member
                ? utils_1.stripObjectToScalars(member, ["user", "roles"])
                : { id: mute.user_id, user: new utils_1.UnknownUser({ id: mute.user_id }) },
        });
        pluginData.state.events.emit("unmute", mute.user_id);
    }
}
exports.clearExpiredMutes = clearExpiredMutes;
