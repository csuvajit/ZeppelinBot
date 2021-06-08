"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForcemuteCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const actualMuteUserCmd_1 = require("../functions/actualMuteUserCmd");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
    notify: commandTypes_1.commandTypeHelpers.string({ option: true }),
    "notify-channel": commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
};
exports.ForcemuteCmd = types_1.modActionsCmd({
    trigger: "forcemute",
    permission: "can_mute",
    description: "Force-mute the specified user, even if they're not on the server",
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
        // Make sure we're allowed to mute this user
        if (memberToMute && !pluginUtils_1.canActOn(pluginData, msg.member, memberToMute)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot mute: insufficient permissions");
            return;
        }
        actualMuteUserCmd_1.actualMuteUserCmd(pluginData, user, msg, { ...args, notify: "none" });
    },
});
