"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveServerCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
exports.LeaveServerCmd = types_1.botControlCmd({
    trigger: ["leave_server", "leave_guild"],
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
        const guildToLeave = pluginData.client.guilds.get(args.guildId);
        const guildName = guildToLeave.name;
        try {
            await pluginData.client.leaveGuild(args.guildId);
        }
        catch (e) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to leave guild: ${e.message}`);
            return;
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Left guild **${guildName}**`);
    },
});
