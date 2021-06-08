"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingableRoleDisableCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
exports.PingableRoleDisableCmd = types_1.pingableRolesCmd({
    trigger: ["pingable_role disable", "pingable_role d"],
    permission: "can_manage",
    signature: {
        channelId: commandTypes_1.commandTypeHelpers.channelId(),
        role: commandTypes_1.commandTypeHelpers.role(),
    },
    async run({ message: msg, args, pluginData }) {
        const pingableRole = await pluginData.state.pingableRoles.getByChannelAndRoleId(args.channelId, args.role.id);
        if (!pingableRole) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `**${args.role.name}** is not set as pingable in <#${args.channelId}>`);
            return;
        }
        await pluginData.state.pingableRoles.delete(args.channelId, args.role.id);
        pluginData.state.cache.delete(args.channelId);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `**${args.role.name}** is no longer set as pingable in <#${args.channelId}>`);
    },
});
