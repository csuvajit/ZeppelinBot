"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsGuildMemberRemoveEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
exports.LogsGuildMemberRemoveEvt = types_1.logsEvt({
    event: "guildMemberRemove",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_LEAVE, {
            member: utils_1.stripObjectToScalars(meta.args.member, ["user", "roles"]),
        });
    },
});
