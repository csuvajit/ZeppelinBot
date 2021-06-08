"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftbanCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const actualKickMemberCmd_1 = require("../functions/actualKickMemberCmd");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
    notify: commandTypes_1.commandTypeHelpers.string({ option: true }),
    "notify-channel": commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
};
exports.SoftbanCmd = types_1.modActionsCmd({
    trigger: "softban",
    permission: "can_kick",
    description: utils_1.trimPluginDescription(`
        "Softban" the specified user by banning and immediately unbanning them. Effectively a kick with message deletions.
        This command will be removed in the future, please use kick with the \`- clean\` argument instead
    `),
    signature: [
        {
            user: commandTypes_1.commandTypeHelpers.string(),
            reason: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
            ...opts,
        },
    ],
    async run({ pluginData, message: msg, args }) {
        await actualKickMemberCmd_1.actualKickMemberCmd(pluginData, msg, { clean: true, ...args });
        await msg.channel.createMessage("Softban will be removed in the future - please use the kick command with the `-clean` argument instead!");
    },
});
