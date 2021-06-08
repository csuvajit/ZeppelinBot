"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearReactionRolesCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
exports.ClearReactionRolesCmd = types_1.reactionRolesCmd({
    trigger: "reaction_roles clear",
    permission: "can_manage",
    signature: {
        message: commandTypes_1.commandTypeHelpers.messageTarget(),
    },
    async run({ message: msg, args, pluginData }) {
        const existingReactionRoles = pluginData.state.reactionRoles.getForMessage(args.message.messageId);
        if (!existingReactionRoles) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Message doesn't have reaction roles on it");
            return;
        }
        pluginData.state.reactionRoles.removeFromMessage(args.message.messageId);
        let targetMessage;
        try {
            targetMessage = await args.message.channel.getMessage(args.message.messageId);
        }
        catch (err) {
            if (utils_1.isDiscordRESTError(err) && err.code === 50001) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Missing access to the specified message");
                return;
            }
            throw err;
        }
        await targetMessage.removeReactions();
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Reaction roles cleared");
    },
});
