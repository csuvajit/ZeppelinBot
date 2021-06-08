"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostAlertOnMemberJoinEvt = void 0;
const types_1 = require("../types");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const hasDiscordPermissions_1 = require("../../../utils/hasDiscordPermissions");
/**
 * Show an alert if a member with prior notes joins the server
 */
exports.PostAlertOnMemberJoinEvt = types_1.modActionsEvt({
    event: "guildMemberAdd",
    async listener({ pluginData, args: { guild, member } }) {
        const config = pluginData.config.get();
        if (!config.alert_on_rejoin)
            return;
        const alertChannelId = config.alert_channel;
        if (!alertChannelId)
            return;
        const actions = await pluginData.state.cases.getByUserId(member.id);
        const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
        if (actions.length) {
            const alertChannel = pluginData.guild.channels.get(alertChannelId);
            if (!alertChannel) {
                logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Unknown \`alert_channel\` configured for \`mod_actions\`: \`${alertChannelId}\``,
                });
                return;
            }
            if (!(alertChannel instanceof eris_1.TextChannel)) {
                logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Non-text channel configured as \`alert_channel\` in \`mod_actions\`: \`${alertChannelId}\``,
                });
                return;
            }
            const botMember = await utils_1.resolveMember(pluginData.client, pluginData.guild, pluginData.client.user.id);
            const botPerms = alertChannel.permissionsOf(botMember ?? pluginData.client.user.id);
            if (!hasDiscordPermissions_1.hasDiscordPermissions(botPerms, eris_1.Constants.Permissions.sendMessages)) {
                logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Missing "Send Messages" permissions for the \`alert_channel\` configured in \`mod_actions\`: \`${alertChannelId}\``,
                });
                return;
            }
            await alertChannel.createMessage(`<@!${member.id}> (${member.user.username}#${member.user.discriminator} \`${member.id}\`) joined with ${actions.length} prior record(s)`);
        }
    },
});
