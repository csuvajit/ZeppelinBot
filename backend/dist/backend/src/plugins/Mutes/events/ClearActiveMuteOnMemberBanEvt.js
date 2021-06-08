"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearActiveMuteOnMemberBanEvt = void 0;
const types_1 = require("../types");
/**
 * Clear active mute from the member if the member is banned
 */
exports.ClearActiveMuteOnMemberBanEvt = types_1.mutesEvt({
    event: "guildBanAdd",
    async listener({ pluginData, args: { user } }) {
        const mute = await pluginData.state.mutes.findExistingMuteForUserId(user.id);
        if (mute) {
            pluginData.state.mutes.clear(user.id);
        }
    },
});
