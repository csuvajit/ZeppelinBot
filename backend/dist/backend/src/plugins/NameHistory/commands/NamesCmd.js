"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamesCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const helpers_1 = require("knub/dist/helpers");
const nicknames_1 = require("../../../data/cleanup/nicknames");
const utils_1 = require("../../../utils");
const GuildNicknameHistory_1 = require("../../../data/GuildNicknameHistory");
const UsernameHistory_1 = require("../../../data/UsernameHistory");
const pluginUtils_1 = require("../../../pluginUtils");
exports.NamesCmd = types_1.nameHistoryCmd({
    trigger: "names",
    permission: "can_view",
    signature: {
        userId: commandTypes_1.commandTypeHelpers.userId(),
    },
    async run({ message: msg, args, pluginData }) {
        const nicknames = await pluginData.state.nicknameHistory.getByUserId(args.userId);
        const usernames = await pluginData.state.usernameHistory.getByUserId(args.userId);
        if (nicknames.length === 0 && usernames.length === 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No name history found");
            return;
        }
        const nicknameRows = nicknames.map(r => `\`[${r.timestamp}]\` ${r.nickname ? `**${helpers_1.disableCodeBlocks(r.nickname)}**` : "*None*"}`);
        const usernameRows = usernames.map(r => `\`[${r.timestamp}]\` **${helpers_1.disableCodeBlocks(r.username)}**`);
        const user = pluginData.client.users.get(args.userId);
        const currentUsername = user ? `${user.username}#${user.discriminator}` : args.userId;
        const nicknameDays = Math.round(nicknames_1.NICKNAME_RETENTION_PERIOD / utils_1.DAYS);
        const usernameDays = Math.round(nicknames_1.NICKNAME_RETENTION_PERIOD / utils_1.DAYS);
        let message = `Name history for **${currentUsername}**:`;
        if (nicknameRows.length) {
            message += `\n\n__Last ${GuildNicknameHistory_1.MAX_NICKNAME_ENTRIES_PER_USER} nicknames within ${nicknameDays} days:__\n${nicknameRows.join("\n")}`;
        }
        if (usernameRows.length) {
            message += `\n\n__Last ${UsernameHistory_1.MAX_USERNAME_ENTRIES_PER_USER} usernames within ${usernameDays} days:__\n${usernameRows.join("\n")}`;
        }
        helpers_1.createChunkedMessage(msg.channel, message);
    },
});
