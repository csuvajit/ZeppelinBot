"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPingableRolesForChannel = void 0;
async function getPingableRolesForChannel(pluginData, channelId) {
    if (!pluginData.state.cache.has(channelId)) {
        pluginData.state.cache.set(channelId, await pluginData.state.pingableRoles.getForChannel(channelId));
    }
    return pluginData.state.cache.get(channelId);
}
exports.getPingableRolesForChannel = getPingableRolesForChannel;
