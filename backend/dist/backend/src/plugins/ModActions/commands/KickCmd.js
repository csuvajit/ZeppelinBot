"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KickCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const actualKickMemberCmd_1 = require("../functions/actualKickMemberCmd");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
    notify: commandTypes_1.commandTypeHelpers.string({ option: true }),
    "notify-channel": commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
    clean: commandTypes_1.commandTypeHelpers.bool({ option: true, isSwitch: true }),
};
exports.KickCmd = types_1.modActionsCmd({
    trigger: "kick",
    permission: "can_kick",
    description: "Kick the specified member",
    signature: [
        {
            user: commandTypes_1.commandTypeHelpers.string(),
            reason: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
            ...opts,
        },
    ],
    async run({ pluginData, message: msg, args }) {
        actualKickMemberCmd_1.actualKickMemberCmd(pluginData, msg, args);
    },
});
