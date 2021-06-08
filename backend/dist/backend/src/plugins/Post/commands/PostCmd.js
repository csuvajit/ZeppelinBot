"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const actualPostCmd_1 = require("../util/actualPostCmd");
exports.PostCmd = types_1.postCmd({
    trigger: "post",
    permission: "can_post",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel(),
        content: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
        "enable-mentions": commandTypes_1.commandTypeHelpers.bool({ option: true, isSwitch: true }),
        schedule: commandTypes_1.commandTypeHelpers.string({ option: true }),
        repeat: commandTypes_1.commandTypeHelpers.delay({ option: true }),
        "repeat-until": commandTypes_1.commandTypeHelpers.string({ option: true }),
        "repeat-times": commandTypes_1.commandTypeHelpers.number({ option: true }),
    },
    async run({ message: msg, args, pluginData }) {
        actualPostCmd_1.actualPostCmd(pluginData, msg, args.channel, { content: args.content }, args);
    },
});
