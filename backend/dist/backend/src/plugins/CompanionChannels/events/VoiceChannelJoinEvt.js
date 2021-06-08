"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelJoinEvt = void 0;
const types_1 = require("../types");
const handleCompanionPermissions_1 = require("../functions/handleCompanionPermissions");
exports.VoiceChannelJoinEvt = types_1.companionChannelsEvt({
    event: "voiceChannelJoin",
    listener({ pluginData, args: { member, newChannel } }) {
        handleCompanionPermissions_1.handleCompanionPermissions(pluginData, member.id, newChannel);
    },
});
