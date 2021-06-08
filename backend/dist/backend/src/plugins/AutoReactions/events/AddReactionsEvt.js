"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReactionsEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const eris_1 = require("eris");
const getMissingChannelPermissions_1 = require("../../../utils/getMissingChannelPermissions");
const readChannelPermissions_1 = require("../../../utils/readChannelPermissions");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
const p = eris_1.Constants.Permissions;
exports.AddReactionsEvt = types_1.autoReactionsEvt({
    event: "messageCreate",
    allowBots: true,
    allowSelf: true,
    async listener({ pluginData, args: { message } }) {
        const autoReaction = await pluginData.state.autoReactions.getForChannel(message.channel.id);
        if (!autoReaction)
            return;
        const me = pluginData.guild.members.get(pluginData.client.user.id);
        const missingPermissions = getMissingChannelPermissions_1.getMissingChannelPermissions(me, message.channel, readChannelPermissions_1.readChannelPermissions | p.addReactions);
        if (missingPermissions) {
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Cannot apply auto-reactions in <#${message.channel.id}>. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`,
            });
            return;
        }
        for (const reaction of autoReaction.reactions) {
            try {
                await message.addReaction(reaction);
            }
            catch (e) {
                if (utils_1.isDiscordRESTError(e)) {
                    const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
                    if (e.code === 10008) {
                        logs.log(LogType_1.LogType.BOT_ALERT, {
                            body: `Could not apply auto-reactions in <#${message.channel.id}> for message \`${message.id}\`. Make sure nothing is deleting the message before the reactions are applied.`,
                        });
                    }
                    else {
                        logs.log(LogType_1.LogType.BOT_ALERT, {
                            body: `Could not apply auto-reactions in <#${message.channel.id}> for message \`${message.id}\`. Error code ${e.code}.`,
                        });
                    }
                    break;
                }
                else {
                    throw e;
                }
            }
        }
    },
});
