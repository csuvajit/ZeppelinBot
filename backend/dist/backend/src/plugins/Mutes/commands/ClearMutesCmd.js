"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearMutesCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
exports.ClearMutesCmd = types_1.mutesCmd({
    trigger: "clear_mutes",
    permission: "can_cleanup",
    description: "Clear dangling mute records from the bot. Be careful not to clear valid mutes.",
    signature: {
        userIds: commandTypes_1.commandTypeHelpers.string({ rest: true }),
    },
    async run({ pluginData, message: msg, args }) {
        const failed = [];
        for (const id of args.userIds) {
            const mute = await pluginData.state.mutes.findExistingMuteForUserId(id);
            if (!mute) {
                failed.push(id);
                continue;
            }
            await pluginData.state.mutes.clear(id);
        }
        if (failed.length !== args.userIds.length) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `**${args.userIds.length - failed.length} active mute(s) cleared**`);
        }
        if (failed.length) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `**${failed.length}/${args.userIds.length} IDs failed**, they are not muted: ${failed.join(" ")}`);
        }
    },
});
