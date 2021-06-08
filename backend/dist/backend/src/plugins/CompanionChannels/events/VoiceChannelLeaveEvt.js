"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelLeaveEvt = void 0;
const types_1 = require("../types");
const handleCompanionPermissions_1 = require("../functions/handleCompanionPermissions");
exports.VoiceChannelLeaveEvt = types_1.companionChannelsEvt({
    event: "voiceChannelLeave",
    listener({ pluginData, args: { member, oldChannel } }) {
        handleCompanionPermissions_1.handleCompanionPermissions(pluginData, member.id, null, oldChannel);
    },
});
