"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const isBanned_1 = require("../functions/isBanned");
const helpers_1 = require("knub/dist/helpers");
const actualMuteUserCmd_1 = require("../functions/actualMuteUserCmd");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
    notify: commandTypes_1.commandTypeHelpers.string({ option: true }),
    "notify-channel": commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
};
exports.MuteCmd = types_1.modActionsCmd({
    trigger: "mute",
    permission: "can_mute",
    description: "Mute the specified member",
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
        const memberToMute = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
        if (!memberToMute) {
            const _isBanned = await isBanned_1.isBanned(pluginData, user.id);
            const prefix = pluginData.fullConfig.prefix;
            if (_isBanned) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User is banned. Use \`${prefix}forcemute\` if you want to mute them anyway.`);
                return;
            }
            else {
                // Ask the mod if we should upgrade to a forcemute as the user is not on the server
                const notOnServerMsg = await msg.channel.createMessage("User not found on the server, forcemute instead?");
                const reply = await helpers_1.waitForReaction(pluginData.client, notOnServerMsg, ["✅", "❌"], msg.author.id);
                notOnServerMsg.delete().catch(utils_1.noop);
                if (!reply || reply.name === "❌") {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "User not on server, mute cancelled by moderator");
                    return;
                }
            }
        }
        // Make sure we're allowed to mute this member
        if (memberToMute && !pluginUtils_1.canActOn(pluginData, msg.member, memberToMute)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot mute: insufficient permissions");
            return;
        }
        actualMuteUserCmd_1.actualMuteUserCmd(pluginData, user, msg, args);
    },
});
