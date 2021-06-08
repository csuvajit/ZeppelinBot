"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualUnmuteCmd = void 0;
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const formatReasonWithAttachments_1 = require("./formatReasonWithAttachments");
const MutesPlugin_1 = require("../../../plugins/Mutes/MutesPlugin");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
async function actualUnmuteCmd(pluginData, user, msg, args) {
    // The moderator who did the action is the message author or, if used, the specified -mod
    let mod = msg.author;
    let pp = null;
    if (args.mod) {
        if (!(await pluginUtils_1.hasPermission(pluginData, "can_act_as_other", { message: msg, channelId: msg.channel.id }))) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You don't have permission to use -mod");
            return;
        }
        mod = args.mod.user;
        pp = msg.author;
    }
    const reason = args.reason ? formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments) : undefined;
    const mutesPlugin = pluginData.getPlugin(MutesPlugin_1.MutesPlugin);
    const result = await mutesPlugin.unmuteUser(user.id, args.time, {
        modId: mod.id,
        ppId: pp ? pp.id : undefined,
        reason,
    });
    if (!result) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "User is not muted!");
        return;
    }
    // Confirm the action to the moderator
    if (args.time) {
        const timeUntilUnmute = args.time && humanize_duration_1.default(args.time);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, utils_1.asSingleLine(`
        Unmuting **${user.username}#${user.discriminator}**
        in ${timeUntilUnmute} (Case #${result.case.case_number})
      `));
    }
    else {
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, utils_1.asSingleLine(`
        Unmuted **${user.username}#${user.discriminator}**
        (Case #${result.case.case_number})
      `));
    }
}
exports.actualUnmuteCmd = actualUnmuteCmd;
