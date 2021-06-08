"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplyingEntries = void 0;
async function getApplyingEntries(pluginData, msg) {
    const config = await pluginData.config.getForMessage(msg);
    return Object.entries(config.entries)
        .filter(([k, e]) => e.can_use && !(!e.can_ignore_cooldown && pluginData.state.cooldowns.isOnCooldown(`${k}:${msg.author.id}`)))
        .map(pair => pair[1]);
}
exports.getApplyingEntries = getApplyingEntries;
