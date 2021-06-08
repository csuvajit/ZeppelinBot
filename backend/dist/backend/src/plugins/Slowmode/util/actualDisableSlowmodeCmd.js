"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualDisableSlowmodeCmd = void 0;
const pluginUtils_1 = require("../../../pluginUtils");
const disableBotSlowmodeForChannel_1 = require("./disableBotSlowmodeForChannel");
const utils_1 = require("../../../utils");
const getMissingChannelPermissions_1 = require("../../../utils/getMissingChannelPermissions");
const requiredPermissions_1 = require("../requiredPermissions");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
async function actualDisableSlowmodeCmd(msg, args, pluginData) {
    const botSlowmode = await pluginData.state.slowmodes.getChannelSlowmode(args.channel.id);
    const hasNativeSlowmode = args.channel.rateLimitPerUser;
    if (!botSlowmode && hasNativeSlowmode === 0) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Channel is not on slowmode!");
        return;
    }
    const me = pluginData.guild.members.get(pluginData.client.user.id);
    const missingPermissions = getMissingChannelPermissions_1.getMissingChannelPermissions(me, args.channel, requiredPermissions_1.BOT_SLOWMODE_DISABLE_PERMISSIONS);
    if (missingPermissions) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Unable to disable slowmode. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`);
        return;
    }
    const initMsg = await msg.channel.createMessage("Disabling slowmode...");
    // Disable bot-maintained slowmode
    let failedUsers = [];
    if (botSlowmode) {
        const result = await disableBotSlowmodeForChannel_1.disableBotSlowmodeForChannel(pluginData, args.channel);
        failedUsers = result.failedUsers;
    }
    // Disable native slowmode
    if (hasNativeSlowmode) {
        await args.channel.edit({ rateLimitPerUser: 0 });
    }
    if (failedUsers.length) {
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Slowmode disabled! Failed to clear slowmode from the following users:\n\n<@!${failedUsers.join(">\n<@!")}>`);
    }
    else {
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Slowmode disabled!");
        initMsg.delete().catch(utils_1.noop);
    }
}
exports.actualDisableSlowmodeCmd = actualDisableSlowmodeCmd;
