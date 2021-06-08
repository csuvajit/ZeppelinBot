"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewAutoReactionsCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const getMissingChannelPermissions_1 = require("../../../utils/getMissingChannelPermissions");
const eris_1 = require("eris");
const readChannelPermissions_1 = require("../../../utils/readChannelPermissions");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
const requiredPermissions = readChannelPermissions_1.readChannelPermissions | eris_1.Constants.Permissions.addReactions;
exports.NewAutoReactionsCmd = types_1.autoReactionsCmd({
    trigger: "auto_reactions",
    permission: "can_manage",
    usage: "!auto_reactions 629990160477585428 👍 👎",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.channel(),
        reactions: commandTypes_1.commandTypeHelpers.string({ rest: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const finalReactions = [];
        const me = pluginData.guild.members.get(pluginData.client.user.id);
        const missingPermissions = getMissingChannelPermissions_1.getMissingChannelPermissions(me, args.channel, requiredPermissions);
        if (missingPermissions) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Cannot set auto-reactions for that channel. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`);
            return;
        }
        for (const reaction of args.reactions) {
            if (!utils_1.isEmoji(reaction)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "One or more of the specified reactions were invalid!");
                return;
            }
            let savedValue;
            const customEmojiMatch = reaction.match(utils_1.customEmojiRegex);
            if (customEmojiMatch) {
                // Custom emoji
                if (!utils_1.canUseEmoji(pluginData.client, customEmojiMatch[2])) {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "I can only use regular emojis and custom emojis from this server");
                    return;
                }
                savedValue = `${customEmojiMatch[1]}:${customEmojiMatch[2]}`;
            }
            else {
                // Unicode emoji
                savedValue = reaction;
            }
            finalReactions.push(savedValue);
        }
        await pluginData.state.autoReactions.set(args.channel.id, finalReactions);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Auto-reactions set for <#${args.channel.id}>`);
    },
});
