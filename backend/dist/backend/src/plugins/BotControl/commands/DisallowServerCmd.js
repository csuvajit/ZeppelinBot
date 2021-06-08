"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisallowServerCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
exports.DisallowServerCmd = types_1.botControlCmd({
    trigger: ["disallow_server", "disallowserver", "remove_server", "removeserver"],
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    signature: {
        guildId: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ pluginData, message: msg, args }) {
        const existing = await pluginData.state.allowedGuilds.find(args.guildId);
        if (!existing) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "That server is not allowed in the first place!");
            return;
        }
        await pluginData.state.allowedGuilds.remove(args.guildId);
        await pluginData.client.leaveGuild(args.guildId).catch(utils_1.noop);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Server removed!");
    },
});
