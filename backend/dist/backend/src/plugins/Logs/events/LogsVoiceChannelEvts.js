"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsVoiceSwitchEvt = exports.LogsVoiceLeaveEvt = exports.LogsVoiceJoinEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
exports.LogsVoiceJoinEvt = types_1.logsEvt({
    event: "voiceChannelJoin",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.VOICE_CHANNEL_JOIN, {
            member: utils_1.stripObjectToScalars(meta.args.member, ["user", "roles"]),
            channel: utils_1.stripObjectToScalars(meta.args.newChannel),
        });
    },
});
exports.LogsVoiceLeaveEvt = types_1.logsEvt({
    event: "voiceChannelLeave",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.VOICE_CHANNEL_LEAVE, {
            member: utils_1.stripObjectToScalars(meta.args.member, ["user", "roles"]),
            channel: utils_1.stripObjectToScalars(meta.args.oldChannel),
        });
    },
});
exports.LogsVoiceSwitchEvt = types_1.logsEvt({
    event: "voiceChannelSwitch",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.VOICE_CHANNEL_MOVE, {
            member: utils_1.stripObjectToScalars(meta.args.member, ["user", "roles"]),
            oldChannel: utils_1.stripObjectToScalars(meta.args.oldChannel),
            newChannel: utils_1.stripObjectToScalars(meta.args.newChannel),
        });
    },
});
