"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReapplyActiveMuteOnJoinEvt = void 0;
const types_1 = require("../types");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
/**
 * Reapply active mutes on join
 */
exports.ReapplyActiveMuteOnJoinEvt = types_1.mutesEvt({
    event: "guildMemberAdd",
    async listener({ pluginData, args: { member } }) {
        const mute = await pluginData.state.mutes.findExistingMuteForUserId(member.id);
        if (mute) {
            const muteRole = pluginData.config.get().mute_role;
            if (muteRole) {
                const memberRoleLock = await pluginData.locks.acquire(lockNameHelpers_1.memberRolesLock(member));
                await member.addRole(muteRole);
                memberRoleLock.unlock();
            }
            pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_MUTE_REJOIN, {
                member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
            });
        }
    },
});
