"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCreateEvt = exports.ChannelJoinEvt = void 0;
const types_1 = require("../types");
const updateNickname_1 = require("../updateNickname");
exports.ChannelJoinEvt = types_1.nameHistoryEvt({
    event: "voiceChannelJoin",
    async listener(meta) {
        meta.pluginData.state.updateQueue.add(() => updateNickname_1.updateNickname(meta.pluginData, meta.args.member));
    },
});
exports.MessageCreateEvt = types_1.nameHistoryEvt({
    event: "messageCreate",
    async listener(meta) {
        meta.pluginData.state.updateQueue.add(() => updateNickname_1.updateNickname(meta.pluginData, meta.args.message.member));
    },
});
