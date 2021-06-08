"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReloadGlobalPluginsCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const activeReload_1 = require("../activeReload");
exports.ReloadGlobalPluginsCmd = types_1.botControlCmd({
    trigger: "bot_reload_global_plugins",
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    async run({ pluginData, message }) {
        if (activeReload_1.getActiveReload())
            return;
        activeReload_1.setActiveReload(message.channel.guild?.id, message.channel.id);
        await message.channel.createMessage("Reloading global plugins...");
        pluginData.getKnubInstance().reloadGlobalContext();
    },
});
