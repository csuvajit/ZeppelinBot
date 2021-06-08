"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCreateDisablePingableEvt = exports.TypingEnablePingableEvt = void 0;
const types_1 = require("../types");
const getPingableRolesForChannel_1 = require("../utils/getPingableRolesForChannel");
const enablePingableRoles_1 = require("../utils/enablePingableRoles");
const disablePingableRoles_1 = require("../utils/disablePingableRoles");
const TIMEOUT = 10 * 1000;
exports.TypingEnablePingableEvt = types_1.pingableRolesEvt({
    event: "typingStart",
    async listener(meta) {
        const pluginData = meta.pluginData;
        const channel = meta.args.channel;
        const pingableRoles = await getPingableRolesForChannel_1.getPingableRolesForChannel(pluginData, channel.id);
        if (pingableRoles.length === 0)
            return;
        if (pluginData.state.timeouts.has(channel.id)) {
            clearTimeout(pluginData.state.timeouts.get(channel.id));
        }
        enablePingableRoles_1.enablePingableRoles(pluginData, pingableRoles);
        const timeout = setTimeout(() => {
            disablePingableRoles_1.disablePingableRoles(pluginData, pingableRoles);
        }, TIMEOUT);
        pluginData.state.timeouts.set(channel.id, timeout);
    },
});
exports.MessageCreateDisablePingableEvt = types_1.pingableRolesEvt({
    event: "messageCreate",
    async listener(meta) {
        const pluginData = meta.pluginData;
        const msg = meta.args.message;
        const pingableRoles = await getPingableRolesForChannel_1.getPingableRolesForChannel(pluginData, msg.channel.id);
        if (pingableRoles.length === 0)
            return;
        if (pluginData.state.timeouts.has(msg.channel.id)) {
            clearTimeout(pluginData.state.timeouts.get(msg.channel.id));
        }
        disablePingableRoles_1.disablePingableRoles(pluginData, pingableRoles);
    },
});
