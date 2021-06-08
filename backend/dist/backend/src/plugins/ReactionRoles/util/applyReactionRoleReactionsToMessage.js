"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReactionRoleReactionsToMessage = void 0;
const utils_1 = require("../../../utils");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const CLEAR_ROLES_EMOJI = "❌";
/**
 * @return Errors encountered while applying reaction roles, if any
 */
async function applyReactionRoleReactionsToMessage(pluginData, channelId, messageId, reactionRoles) {
    const channel = pluginData.guild.channels.get(channelId);
    if (!channel)
        return;
    const errors = [];
    const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
    let targetMessage;
    try {
        targetMessage = await channel.getMessage(messageId);
    }
    catch (e) {
        if (utils_1.isDiscordRESTError(e)) {
            if (e.code === 10008) {
                // Unknown message, remove reaction roles from the message
                logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Removed reaction roles from unknown message ${channelId}/${messageId} (${pluginData.guild.id})`,
                });
                await pluginData.state.reactionRoles.removeFromMessage(messageId);
            }
            else {
                logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Error ${e.code} when applying reaction roles to message ${channelId}/${messageId}: ${e.message}`,
                });
            }
            errors.push(`Error ${e.code} while fetching reaction role message: ${e.message}`);
            return errors;
        }
        else {
            throw e;
        }
    }
    // Remove old reactions, if any
    try {
        await targetMessage.removeReactions();
    }
    catch (e) {
        if (utils_1.isDiscordRESTError(e)) {
            errors.push(`Error ${e.code} while removing old reactions: ${e.message}`);
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Error ${e.code} while removing old reaction role reactions from message ${channelId}/${messageId}: ${e.message}`,
            });
            return errors;
        }
        throw e;
    }
    await utils_1.sleep(1500);
    // Add reaction role reactions
    const emojisToAdd = reactionRoles.map(rr => rr.emoji);
    emojisToAdd.push(CLEAR_ROLES_EMOJI);
    for (const rawEmoji of emojisToAdd) {
        const emoji = utils_1.isSnowflake(rawEmoji) ? `foo:${rawEmoji}` : rawEmoji;
        try {
            await targetMessage.addReaction(emoji);
            await utils_1.sleep(1250); // Make sure we don't hit rate limits
        }
        catch (e) {
            if (utils_1.isDiscordRESTError(e)) {
                if (e.code === 10014) {
                    pluginData.state.reactionRoles.removeFromMessage(messageId, rawEmoji);
                    errors.push(`Unknown emoji: ${emoji}`);
                    logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Could not add unknown reaction role emoji ${emoji} to message ${channelId}/${messageId}`,
                    });
                    continue;
                }
                else if (e.code === 50013) {
                    errors.push(`Missing permissions to apply reactions`);
                    logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Error ${e.code} while applying reaction role reactions to ${channelId}/${messageId}: ${e.message}`,
                    });
                    break;
                }
            }
            throw e;
        }
    }
    return errors;
}
exports.applyReactionRoleReactionsToMessage = applyReactionRoleReactionsToMessage;
