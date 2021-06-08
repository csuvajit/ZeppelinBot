"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VcdisconnectCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const LogType_1 = require("../../../data/LogType");
const helpers_1 = require("knub/dist/helpers");
exports.VcdisconnectCmd = types_1.utilityCmd({
    trigger: ["vcdisconnect", "vcdisc", "vcdc", "vckick", "vck"],
    description: "Disconnect a member from their voice channel",
    usage: "!vcdc @Dark",
    permission: "can_vckick",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember(),
    },
    async run({ message: msg, args, pluginData }) {
        if (!pluginUtils_1.canActOn(pluginData, msg.member, args.member)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot move: insufficient permissions");
            return;
        }
        if (!args.member.voiceState || !args.member.voiceState.channelID) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Member is not in a voice channel");
            return;
        }
        const channel = (await helpers_1.resolveChannel(pluginData.guild, args.member.voiceState.channelID));
        try {
            await args.member.edit({
                channelID: null,
            });
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Failed to disconnect member");
            return;
        }
        pluginData.state.logs.log(LogType_1.LogType.VOICE_CHANNEL_FORCE_DISCONNECT, {
            mod: utils_1.stripObjectToScalars(msg.author),
            member: utils_1.stripObjectToScalars(args.member, ["user", "roles"]),
            oldChannel: utils_1.stripObjectToScalars(channel),
        });
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `**${args.member.user.username}#${args.member.user.discriminator}** disconnected from **${channel.name}**`);
    },
});
