"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelSwitchEvt = void 0;
const types_1 = require("../types");
const handleCompanionPermissions_1 = require("../functions/handleCompanionPermissions");
exports.VoiceChannelSwitchEvt = types_1.companionChannelsEvt({
    event: "voiceChannelSwitch",
    listener({ pluginData, args: { member, oldChannel, newChannel } }) {
        handleCompanionPermissions_1.handleCompanionPermissions(pluginData, member.id, newChannel, oldChannel);
    },
});
