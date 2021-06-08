"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicknameResetCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
exports.NicknameResetCmd = types_1.utilityCmd({
    trigger: ["nickname reset", "nick reset"],
    description: "Reset a member's nickname to their username",
    usage: "!nickname reset 106391128718245888",
    permission: "can_nickname",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember(),
    },
    async run({ message: msg, args, pluginData }) {
        if (msg.member.id !== args.member.id && !pluginUtils_1.canActOn(pluginData, msg.member, args.member)) {
            msg.channel.createMessage(utils_1.errorMessage("Cannot reset nickname: insufficient permissions"));
            return;
        }
        try {
            await args.member.edit({
                nick: "",
            });
        }
        catch {
            msg.channel.createMessage(utils_1.errorMessage("Failed to reset nickname"));
            return;
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `The nickname of <@!${args.member.id}> has been reset`);
    },
});
