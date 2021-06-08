"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceUnmuteCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const actualUnmuteUserCmd_1 = require("../functions/actualUnmuteUserCmd");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
};
exports.ForceUnmuteCmd = types_1.modActionsCmd({
    trigger: "forceunmute",
    permission: "can_mute",
    description: "Force-unmute the specified user, even if they're not on the server",
    signature: [
        {
            user: commandTypes_1.commandTypeHelpers.string(),
            time: commandTypes_1.commandTypeHelpers.delay(),
            reason: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
            ...opts,
        },
        {
            user: commandTypes_1.commandTypeHelpers.string(),
            reason: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
            ...opts,
        },
    ],
    async run({ pluginData, message: msg, args }) {
        const user = await utils_1.resolveUser(pluginData.client, args.user);
        if (!user.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found`);
            return;
        }
        // Check if they're muted in the first place
        if (!(await pluginData.state.mutes.isMuted(user.id))) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot unmute: member is not muted");
            return;
        }
        // Find the server member to unmute
        const memberToUnmute = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
        // Make sure we're allowed to unmute this member
        if (memberToUnmute && !pluginUtils_1.canActOn(pluginData, msg.member, memberToUnmute)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot unmute: insufficient permissions");
            return;
        }
        actualUnmuteUserCmd_1.actualUnmuteCmd(pluginData, user, msg, args);
    },
});
