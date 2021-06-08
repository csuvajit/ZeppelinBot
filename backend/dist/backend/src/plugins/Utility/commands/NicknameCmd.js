"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicknameCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
exports.NicknameCmd = types_1.utilityCmd({
    trigger: ["nickname", "nick"],
    description: "Set a member's nickname",
    usage: "!nickname 106391128718245888 Drag",
    permission: "can_nickname",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember(),
        nickname: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        if (msg.member.id !== args.member.id && !pluginUtils_1.canActOn(pluginData, msg.member, args.member)) {
            msg.channel.createMessage(utils_1.errorMessage("Cannot change nickname: insufficient permissions"));
            return;
        }
        const nicknameLength = [...args.nickname].length;
        if (nicknameLength < 2 || nicknameLength > 32) {
            msg.channel.createMessage(utils_1.errorMessage("Nickname must be between 2 and 32 characters long"));
            return;
        }
        const oldNickname = args.member.nick || "<none>";
        try {
            await args.member.edit({
                nick: args.nickname,
            });
        }
        catch {
            msg.channel.createMessage(utils_1.errorMessage("Failed to change nickname"));
            return;
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Changed nickname of <@!${args.member.id}> from **${oldNickname}** to **${args.nickname}**`);
    },
});
