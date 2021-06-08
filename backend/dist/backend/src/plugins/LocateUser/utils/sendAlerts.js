"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlerts = void 0;
const utils_1 = require("../../../utils");
const sendWhere_1 = require("./sendWhere");
const moveMember_1 = require("./moveMember");
async function sendAlerts(pluginData, userId) {
    const triggeredAlerts = await pluginData.state.alerts.getAlertsByUserId(userId);
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, userId);
    if (!member)
        return;
    triggeredAlerts.forEach(alert => {
        const prepend = `<@!${alert.requestor_id}>, an alert requested by you has triggered!\nReminder: \`${alert.body}\`\n`;
        const txtChannel = pluginData.client.getChannel(alert.channel_id);
        sendWhere_1.sendWhere(pluginData, member, txtChannel, prepend);
        if (alert.active) {
            moveMember_1.moveMember(pluginData, alert.requestor_id, member, txtChannel);
        }
    });
}
exports.sendAlerts = sendAlerts;
