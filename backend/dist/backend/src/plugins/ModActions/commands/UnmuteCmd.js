"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnmuteCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const MutesPlugin_1 = require("../../../plugins/Mutes/MutesPlugin");
const actualUnmuteUserCmd_1 = require("../functions/actualUnmuteUserCmd");
const isBanned_1 = require("../functions/isBanned");
const helpers_1 = require("knub/dist/helpers");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
};
exports.UnmuteCmd = types_1.modActionsCmd({
    trigger: "unmute",
    permission: "can_mute",
    description: "Unmute the specified member",
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
        const memberToUnmute = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
        const mutesPlugin = pluginData.getPlugin(MutesPlugin_1.MutesPlugin);
        const hasMuteRole = memberToUnmute && mutesPlugin.hasMutedRole(memberToUnmute);
        // Check if they're muted in the first place
        if (!(await pluginData.state.mutes.isMuted(args.user)) && !hasMuteRole) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot unmute: member is not muted");
            return;
        }
        if (!memberToUnmute) {
            const banned = await isBanned_1.isBanned(pluginData, user.id);
            const prefix = pluginData.fullConfig.prefix;
            if (banned) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User is banned. Use \`${prefix}forceunmute\` to unmute them anyway.`);
                return;
            }
            else {
                // Ask the mod if we should upgrade to a forceunmute as the user is not on the server
                const notOnServerMsg = await msg.channel.createMessage("User not found on the server, forceunmute instead?");
                const reply = await helpers_1.waitForReaction(pluginData.client, notOnServerMsg, ["✅", "❌"], msg.author.id);
                notOnServerMsg.delete().catch(utils_1.noop);
                if (!reply || reply.name === "❌") {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "User not on server, unmute cancelled by moderator");
                    return;
                }
            }
        }
        // Make sure we're allowed to unmute this member
        if (memberToUnmute && !pluginUtils_1.canActOn(pluginData, msg.member, memberToUnmute)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot unmute: insufficient permissions");
            return;
        }
        actualUnmuteUserCmd_1.actualUnmuteCmd(pluginData, user, msg, args);
    },
});
