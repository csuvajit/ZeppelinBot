"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const getUserInfoEmbed_1 = require("../functions/getUserInfoEmbed");
const pluginUtils_1 = require("../../../pluginUtils");
exports.UserInfoCmd = types_1.utilityCmd({
    trigger: ["user", "userinfo", "whois"],
    description: "Show information about a user",
    usage: "!user 106391128718245888",
    permission: "can_userinfo",
    signature: {
        user: commandTypes_1.commandTypeHelpers.resolvedUserLoose({ required: false }),
        compact: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "c" }),
    },
    async run({ message, args, pluginData }) {
        const userId = args.user?.id || message.author.id;
        const embed = await getUserInfoEmbed_1.getUserInfoEmbed(pluginData, userId, args.compact, message.author.id);
        if (!embed) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "User not found");
            return;
        }
        message.channel.createMessage({ embed });
    },
});
