"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowmodeDisableCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const types_1 = require("../types");
const actualDisableSlowmodeCmd_1 = require("../util/actualDisableSlowmodeCmd");
exports.SlowmodeDisableCmd = types_1.slowmodeCmd({
    trigger: ["slowmode disable", "slowmode d"],
    permission: "can_manage",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel(),
    },
    async run({ message: msg, args, pluginData }) {
        // Workaround until you can call this cmd from SlowmodeSetChannelCmd
        actualDisableSlowmodeCmd_1.actualDisableSlowmodeCmd(msg, args, pluginData);
    },
});
