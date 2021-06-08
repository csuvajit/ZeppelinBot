"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReloadGuildCmd = void 0;
const types_1 = require("../types");
const guildReloads_1 = require("../guildReloads");
exports.ReloadGuildCmd = types_1.utilityCmd({
    trigger: "reload_guild",
    description: "Reload the Zeppelin configuration and all plugins for the server. This can sometimes fix issues.",
    permission: "can_reload_guild",
    async run({ message: msg, args, pluginData }) {
        if (guildReloads_1.activeReloads.has(pluginData.guild.id))
            return;
        guildReloads_1.activeReloads.set(pluginData.guild.id, msg.channel);
        msg.channel.createMessage("Reloading...");
        pluginData.getKnubInstance().reloadGuild(pluginData.guild.id);
    },
});
