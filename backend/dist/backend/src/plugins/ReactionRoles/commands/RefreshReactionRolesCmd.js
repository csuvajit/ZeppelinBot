"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshReactionRolesCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const refreshReactionRoles_1 = require("../util/refreshReactionRoles");
exports.RefreshReactionRolesCmd = types_1.reactionRolesCmd({
    trigger: "reaction_roles refresh",
    permission: "can_manage",
    signature: {
        message: commandTypes_1.commandTypeHelpers.messageTarget(),
    },
    async run({ message: msg, args, pluginData }) {
        if (pluginData.state.pendingRefreshes.has(`${args.message.channel.id}-${args.message.messageId}`)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Another refresh in progress");
            return;
        }
        await refreshReactionRoles_1.refreshReactionRoles(pluginData, args.message.channel.id, args.message.messageId);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Reaction roles refreshed");
    },
});
