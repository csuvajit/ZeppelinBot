"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearActiveMuteOnRoleRemovalEvt = void 0;
const types_1 = require("../types");
const memberHasMutedRole_1 = require("../functions/memberHasMutedRole");
/**
 * Clear active mute if the mute role is removed manually
 */
exports.ClearActiveMuteOnRoleRemovalEvt = types_1.mutesEvt({
    event: "guildMemberUpdate",
    async listener({ pluginData, args: { member } }) {
        const muteRole = pluginData.config.get().mute_role;
        if (!muteRole)
            return;
        const mute = await pluginData.state.mutes.findExistingMuteForUserId(member.id);
        if (!mute)
            return;
        if (!memberHasMutedRole_1.memberHasMutedRole(pluginData, member)) {
            await pluginData.state.mutes.clear(muteRole);
        }
    },
});
