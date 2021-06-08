"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelJoinUpdateUsernameEvt = exports.MessageCreateUpdateUsernameEvt = void 0;
const types_1 = require("../types");
const updateUsername_1 = require("../updateUsername");
exports.MessageCreateUpdateUsernameEvt = types_1.usernameSaverEvt({
    event: "messageCreate",
    async listener(meta) {
        if (meta.args.message.author.bot)
            return;
        meta.pluginData.state.updateQueue.add(() => updateUsername_1.updateUsername(meta.pluginData, meta.args.message.author));
    },
});
exports.VoiceChannelJoinUpdateUsernameEvt = types_1.usernameSaverEvt({
    event: "voiceChannelJoin",
    async listener(meta) {
        if (meta.args.member.bot)
            return;
        meta.pluginData.state.updateQueue.add(() => updateUsername_1.updateUsername(meta.pluginData, meta.args.member.user));
    },
});
