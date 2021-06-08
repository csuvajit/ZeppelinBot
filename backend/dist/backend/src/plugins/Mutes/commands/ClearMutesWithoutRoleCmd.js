"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearMutesWithoutRoleCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
exports.ClearMutesWithoutRoleCmd = types_1.mutesCmd({
    trigger: "clear_mutes_without_role",
    permission: "can_cleanup",
    description: "Clear dangling mutes for members whose mute role was removed by other means",
    async run({ pluginData, message: msg }) {
        const activeMutes = await pluginData.state.mutes.getActiveMutes();
        const muteRole = pluginData.config.get().mute_role;
        if (!muteRole)
            return;
        await msg.channel.createMessage("Clearing mutes from members that don't have the mute role...");
        let cleared = 0;
        for (const mute of activeMutes) {
            const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, mute.user_id);
            if (!member)
                continue;
            if (!member.roles.includes(muteRole)) {
                await pluginData.state.mutes.clear(mute.user_id);
                cleared++;
            }
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Cleared ${cleared} mutes from members that don't have the mute role`);
    },
});
