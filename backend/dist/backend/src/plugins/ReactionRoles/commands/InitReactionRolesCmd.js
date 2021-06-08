"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitReactionRolesCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const applyReactionRoleReactionsToMessage_1 = require("../util/applyReactionRoleReactionsToMessage");
const canReadChannel_1 = require("../../../utils/canReadChannel");
const CLEAR_ROLES_EMOJI = "❌";
exports.InitReactionRolesCmd = types_1.reactionRolesCmd({
    trigger: "reaction_roles",
    permission: "can_manage",
    description: utils_1.trimPluginDescription(`
  This command allows you to add reaction roles to a given message.  
  The basic usage is as follows:  
    
  !reaction_roles 800865377520582687  
  👍 = 556110793058287637  
  👎 = 558037973581430785  
    
  A reactionRolePair is any emoji the bot can use, an equal sign and the role id it should correspond to.  
  Every pair needs to be in its own line for the command to work properly.  
  If the message you specify is not found, use \`!save_messages_to_db <channelId> <messageId>\`  
  to manually add it to the stored messages database permanently.
  `),
    signature: {
        message: commandTypes_1.commandTypeHelpers.messageTarget(),
        reactionRolePairs: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
        exclusive: commandTypes_1.commandTypeHelpers.bool({ option: true, isSwitch: true, shortcut: "e" }),
    },
    async run({ message: msg, args, pluginData }) {
        if (!canReadChannel_1.canReadChannel(args.message.channel, msg.member)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You can't add reaction roles to channels you can't see yourself");
            return;
        }
        let targetMessage;
        try {
            targetMessage = await args.message.channel.getMessage(args.message.messageId).catch(utils_1.noop);
        }
        catch (e) {
            if (utils_1.isDiscordRESTError(e)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Error ${e.code} while getting message: ${e.message}`);
                return;
            }
            throw e;
        }
        // Clear old reaction roles for the message from the DB
        await pluginData.state.reactionRoles.removeFromMessage(targetMessage.id);
        // Turn "emoji = role" pairs into an array of tuples of the form [emoji, roleId]
        // Emoji is either a unicode emoji or the snowflake of a custom emoji
        const emojiRolePairs = args.reactionRolePairs
            .trim()
            .split("\n")
            .map(v => v.split(/[\s=,]+/).map(v => v.trim())) // tslint:disable-line
            .map((pair) => {
            const customEmojiMatch = pair[0].match(/^<a?:(.*?):(\d+)>$/);
            if (customEmojiMatch) {
                return [customEmojiMatch[2], pair[1], customEmojiMatch[1]];
            }
            else {
                return pair;
            }
        });
        // Verify the specified emojis and roles are valid and usable
        for (const pair of emojiRolePairs) {
            if (pair[0] === CLEAR_ROLES_EMOJI) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `The emoji for clearing roles (${CLEAR_ROLES_EMOJI}) is reserved and cannot be used`);
                return;
            }
            if (!utils_1.isValidEmoji(pair[0])) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Invalid emoji: ${pair[0]}`);
                return;
            }
            if (!utils_1.canUseEmoji(pluginData.client, pair[0])) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "I can only use regular emojis and custom emojis from servers I'm on");
                return;
            }
            if (!pluginData.guild.roles.has(pair[1])) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Unknown role ${pair[1]}`);
                return;
            }
        }
        const progressMessage = msg.channel.createMessage("Adding reaction roles...");
        // Save the new reaction roles to the database
        for (const pair of emojiRolePairs) {
            await pluginData.state.reactionRoles.add(args.message.channel.id, targetMessage.id, pair[0], pair[1], args.exclusive);
        }
        // Apply the reactions themselves
        const reactionRoles = await pluginData.state.reactionRoles.getForMessage(targetMessage.id);
        const errors = await applyReactionRoleReactionsToMessage_1.applyReactionRoleReactionsToMessage(pluginData, targetMessage.channel.id, targetMessage.id, reactionRoles);
        if (errors?.length) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Errors while adding reaction roles:\n${errors.join("\n")}`);
        }
        else {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Reaction roles added");
        }
        (await progressMessage).delete().catch(utils_1.noop);
    },
});
