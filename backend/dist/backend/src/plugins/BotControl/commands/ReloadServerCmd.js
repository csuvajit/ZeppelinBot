"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReloadServerCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
exports.ReloadServerCmd = types_1.botControlCmd({
    trigger: ["reload_server", "reload_guild"],
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    signature: {
        guildId: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ pluginData, message: msg, args }) {
        if (!pluginData.client.guilds.has(args.guildId)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "I am not in that guild");
            return;
        }
        try {
            await pluginData.getKnubInstance().reloadGuild(args.guildId);
        }
        catch (e) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to reload guild: ${e.message}`);
            return;
        }
        const guild = pluginData.client.guilds.get(args.guildId);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Reloaded guild **${guild?.name || "???"}**`);
    },
});
