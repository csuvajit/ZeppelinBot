"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelLeaveAlertsEvt = exports.ChannelSwitchAlertsEvt = exports.ChannelJoinAlertsEvt = void 0;
const types_1 = require("../types");
const sendAlerts_1 = require("../utils/sendAlerts");
exports.ChannelJoinAlertsEvt = types_1.locateUserEvt({
    event: "voiceChannelJoin",
    async listener(meta) {
        if (meta.pluginData.state.usersWithAlerts.includes(meta.args.member.id)) {
            sendAlerts_1.sendAlerts(meta.pluginData, meta.args.member.id);
        }
    },
});
exports.ChannelSwitchAlertsEvt = types_1.locateUserEvt({
    event: "voiceChannelSwitch",
    async listener(meta) {
        if (meta.pluginData.state.usersWithAlerts.includes(meta.args.member.id)) {
            sendAlerts_1.sendAlerts(meta.pluginData, meta.args.member.id);
        }
    },
});
exports.ChannelLeaveAlertsEvt = types_1.locateUserEvt({
    event: "voiceChannelLeave",
    async listener(meta) {
        const triggeredAlerts = await meta.pluginData.state.alerts.getAlertsByUserId(meta.args.member.id);
        const voiceChannel = meta.args.oldChannel;
        triggeredAlerts.forEach(alert => {
            const txtChannel = meta.pluginData.client.getChannel(alert.channel_id);
            txtChannel.createMessage(`🔴 <@!${alert.requestor_id}> the user <@!${alert.user_id}> disconnected out of \`${voiceChannel.name}\``);
        });
    },
});
