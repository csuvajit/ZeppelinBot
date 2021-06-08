"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisableAutoReactionsCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
exports.DisableAutoReactionsCmd = types_1.autoReactionsCmd({
    trigger: "auto_reactions disable",
    permission: "can_manage",
    usage: "!auto_reactions disable 629990160477585428",
    signature: {
        channelId: commandTypes_1.commandTypeHelpers.channelId(),
    },
    async run({ message: msg, args, pluginData }) {
        const autoReaction = await pluginData.state.autoReactions.getForChannel(args.channelId);
        if (!autoReaction) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Auto-reactions aren't enabled in <#${args.channelId}>`);
            return;
        }
        await pluginData.state.autoReactions.removeFromChannel(args.channelId);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Auto-reactions disabled in <#${args.channelId}>`);
    },
});
