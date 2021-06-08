"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsRoleDeleteEvt = exports.LogsRoleCreateEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
exports.LogsRoleCreateEvt = types_1.logsEvt({
    event: "guildRoleCreate",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.ROLE_CREATE, {
            role: utils_1.stripObjectToScalars(meta.args.role),
        });
    },
});
exports.LogsRoleDeleteEvt = types_1.logsEvt({
    event: "guildRoleDelete",
    async listener(meta) {
        meta.pluginData.state.guildLogs.log(LogType_1.LogType.ROLE_DELETE, {
            role: utils_1.stripObjectToScalars(meta.args.role),
        });
    },
});
