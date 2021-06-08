"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingableRoleEnableCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
exports.PingableRoleEnableCmd = types_1.pingableRolesCmd({
    trigger: "pingable_role",
    permission: "can_manage",
    signature: {
        channelId: commandTypes_1.commandTypeHelpers.channelId(),
        role: commandTypes_1.commandTypeHelpers.role(),
    },
    async run({ message: msg, args, pluginData }) {
        const existingPingableRole = await pluginData.state.pingableRoles.getByChannelAndRoleId(args.channelId, args.role.id);
        if (existingPingableRole) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `**${args.role.name}** is already set as pingable in <#${args.channelId}>`);
            return;
        }
        await pluginData.state.pingableRoles.add(args.channelId, args.role.id);
        pluginData.state.cache.delete(args.channelId);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `**${args.role.name}** has been set as pingable in <#${args.channelId}>`);
    },
});
