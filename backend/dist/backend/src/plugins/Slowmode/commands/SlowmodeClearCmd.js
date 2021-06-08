"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowmodeClearCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const types_1 = require("../types");
const clearBotSlowmodeFromUserId_1 = require("../util/clearBotSlowmodeFromUserId");
const utils_1 = require("../../../utils");
const getMissingChannelPermissions_1 = require("../../../utils/getMissingChannelPermissions");
const requiredPermissions_1 = require("../requiredPermissions");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
exports.SlowmodeClearCmd = types_1.slowmodeCmd({
    trigger: ["slowmode clear", "slowmode c"],
    permission: "can_manage",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel(),
        user: commandTypes_1.commandTypeHelpers.resolvedUserLoose(),
        force: commandTypes_1.commandTypeHelpers.bool({ option: true, isSwitch: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const channelSlowmode = await pluginData.state.slowmodes.getChannelSlowmode(args.channel.id);
        if (!channelSlowmode) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Channel doesn't have slowmode!");
            return;
        }
        const me = pluginData.guild.members.get(pluginData.client.user.id);
        const missingPermissions = getMissingChannelPermissions_1.getMissingChannelPermissions(me, args.channel, requiredPermissions_1.BOT_SLOWMODE_CLEAR_PERMISSIONS);
        if (missingPermissions) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Unable to clear slowmode. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`);
            return;
        }
        try {
            await clearBotSlowmodeFromUserId_1.clearBotSlowmodeFromUserId(pluginData, args.channel, args.user.id, args.force);
        }
        catch (e) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, utils_1.asSingleLine(`
          Failed to clear slowmode from **${args.user.username}#${args.user.discriminator}** in <#${args.channel.id}>:
          \`${utils_1.disableInlineCode(e.message)}\`
        `));
            return;
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Slowmode cleared from **${args.user.username}#${args.user.discriminator}** in <#${args.channel.id}>`);
    },
});
