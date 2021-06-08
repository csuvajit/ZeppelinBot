"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsChannelDeleteEvt = exports.LogsChannelCreateEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
exports.LogsChannelCreateEvt = types_1.logsEvt({
    event: "channelCreate",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.CHANNEL_CREATE, {
            channel: utils_1.stripObjectToScalars(meta.args.channel),
        });
    },
});
exports.LogsChannelDeleteEvt = types_1.logsEvt({
    event: "channelDelete",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.CHANNEL_DELETE, {
            channel: utils_1.stripObjectToScalars(meta.args.channel),
        });
    },
});
