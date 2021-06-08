"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VcmoveAllCmd = exports.VcmoveCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const eris_1 = require("eris");
const LogType_1 = require("../../../data/LogType");
exports.VcmoveCmd = types_1.utilityCmd({
    trigger: "vcmove",
    description: "Move a member to another voice channel",
    usage: "!vcmove @Dragory 473223047822704651",
    permission: "can_vcmove",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember(),
        channel: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        let channel;
        if (utils_1.isSnowflake(args.channel)) {
            // Snowflake -> resolve channel directly
            const potentialChannel = pluginData.guild.channels.get(args.channel);
            if (!potentialChannel || !(potentialChannel instanceof eris_1.VoiceChannel)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown or non-voice channel");
                return;
            }
            channel = potentialChannel;
        }
        else if (utils_1.channelMentionRegex.test(args.channel)) {
            // Channel mention -> parse channel id and resolve channel from that
            const channelId = args.channel.match(utils_1.channelMentionRegex)[1];
            const potentialChannel = pluginData.guild.channels.get(channelId);
            if (!potentialChannel || !(potentialChannel instanceof eris_1.VoiceChannel)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown or non-voice channel");
                return;
            }
            channel = potentialChannel;
        }
        else {
            // Search string -> find closest matching voice channel name
            const voiceChannels = pluginData.guild.channels.filter(theChannel => {
                return theChannel instanceof eris_1.VoiceChannel;
            });
            const closestMatch = utils_1.simpleClosestStringMatch(args.channel, voiceChannels, ch => ch.name);
            if (!closestMatch) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No matching voice channels");
                return;
            }
            channel = closestMatch;
        }
        if (!args.member.voiceState || !args.member.voiceState.channelID) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Member is not in a voice channel");
            return;
        }
        if (args.member.voiceState.channelID === channel.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Member is already on that channel!");
            return;
        }
        const oldVoiceChannel = pluginData.guild.channels.get(args.member.voiceState.channelID);
        try {
            await args.member.edit({
                channelID: channel.id,
            });
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Failed to move member");
            return;
        }
        pluginData.state.logs.log(LogType_1.LogType.VOICE_CHANNEL_FORCE_MOVE, {
            mod: utils_1.stripObjectToScalars(msg.author),
            member: utils_1.stripObjectToScalars(args.member, ["user", "roles"]),
            oldChannel: utils_1.stripObjectToScalars(oldVoiceChannel),
            newChannel: utils_1.stripObjectToScalars(channel),
        });
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `**${args.member.user.username}#${args.member.user.discriminator}** moved to **${channel.name}**`);
    },
});
exports.VcmoveAllCmd = types_1.utilityCmd({
    trigger: "vcmoveall",
    description: "Move all members of a voice channel to another voice channel",
    usage: "!vcmoveall 551767166395875334 767497573560352798",
    permission: "can_vcmove",
    signature: {
        oldChannel: commandTypes_1.commandTypeHelpers.voiceChannel(),
        channel: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        let channel;
        if (utils_1.isSnowflake(args.channel)) {
            // Snowflake -> resolve channel directly
            const potentialChannel = pluginData.guild.channels.get(args.channel);
            if (!potentialChannel || !(potentialChannel instanceof eris_1.VoiceChannel)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown or non-voice channel");
                return;
            }
            channel = potentialChannel;
        }
        else if (utils_1.channelMentionRegex.test(args.channel)) {
            // Channel mention -> parse channel id and resolve channel from that
            const channelId = args.channel.match(utils_1.channelMentionRegex)[1];
            const potentialChannel = pluginData.guild.channels.get(channelId);
            if (!potentialChannel || !(potentialChannel instanceof eris_1.VoiceChannel)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown or non-voice channel");
                return;
            }
            channel = potentialChannel;
        }
        else {
            // Search string -> find closest matching voice channel name
            const voiceChannels = pluginData.guild.channels.filter(theChannel => {
                return theChannel instanceof eris_1.VoiceChannel;
            });
            const closestMatch = utils_1.simpleClosestStringMatch(args.channel, voiceChannels, ch => ch.name);
            if (!closestMatch) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No matching voice channels");
                return;
            }
            channel = closestMatch;
        }
        if (args.oldChannel.voiceMembers.size === 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Voice channel is empty");
            return;
        }
        if (args.oldChannel.id === channel.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cant move from and to the same channel!");
            return;
        }
        // Cant leave null, otherwise we get an assignment error in the catch
        let currMember = msg.member;
        const moveAmt = args.oldChannel.voiceMembers.size;
        let errAmt = 0;
        for (const memberWithId of args.oldChannel.voiceMembers) {
            currMember = memberWithId[1];
            // Check for permissions but allow self-moves
            if (currMember.id !== msg.member.id && !pluginUtils_1.canActOn(pluginData, msg.member, currMember)) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to move ${currMember.username}#${currMember.discriminator} (${currMember.id}): You cannot act on this member`);
                errAmt++;
                continue;
            }
            try {
                currMember.edit({
                    channelID: channel.id,
                });
            }
            catch {
                if (msg.member.id === currMember.id) {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown error when trying to move members");
                    return;
                }
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to move ${currMember.username}#${currMember.discriminator} (${currMember.id})`);
                errAmt++;
                continue;
            }
            pluginData.state.logs.log(LogType_1.LogType.VOICE_CHANNEL_FORCE_MOVE, {
                mod: utils_1.stripObjectToScalars(msg.author),
                member: utils_1.stripObjectToScalars(currMember, ["user", "roles"]),
                oldChannel: utils_1.stripObjectToScalars(args.oldChannel),
                newChannel: utils_1.stripObjectToScalars(channel),
            });
        }
        if (moveAmt !== errAmt) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `${moveAmt - errAmt} members from **${args.oldChannel.name}** moved to **${channel.name}**`);
        }
        else {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to move any members.`);
        }
    },
});
