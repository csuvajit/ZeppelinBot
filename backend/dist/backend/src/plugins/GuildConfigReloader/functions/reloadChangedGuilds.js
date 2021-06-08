"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadChangedGuilds = void 0;
const utils_1 = require("../../../utils");
const CHECK_INTERVAL = 1 * utils_1.SECONDS;
async function reloadChangedGuilds(pluginData) {
    if (pluginData.state.unloaded)
        return;
    const changedConfigs = await pluginData.state.guildConfigs.getActiveLargerThanId(pluginData.state.highestConfigId);
    for (const item of changedConfigs) {
        if (!item.key.startsWith("guild-"))
            continue;
        const guildId = item.key.slice("guild-".length);
        console.log(`Config changed, reloading guild ${guildId}`);
        await pluginData.getKnubInstance().reloadGuild(guildId);
        if (item.id > pluginData.state.highestConfigId) {
            pluginData.state.highestConfigId = item.id;
        }
    }
    pluginData.state.nextCheckTimeout = setTimeout(() => reloadChangedGuilds(pluginData), CHECK_INTERVAL);
}
exports.reloadChangedGuilds = reloadChangedGuilds;
