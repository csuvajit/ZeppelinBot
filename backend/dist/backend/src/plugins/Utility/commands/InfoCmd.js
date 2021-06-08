"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const getInviteInfoEmbed_1 = require("../functions/getInviteInfoEmbed");
const utils_1 = require("../../../utils");
const getUserInfoEmbed_1 = require("../functions/getUserInfoEmbed");
const resolveMessageTarget_1 = require("../../../utils/resolveMessageTarget");
const canReadChannel_1 = require("../../../utils/canReadChannel");
const getMessageInfoEmbed_1 = require("../functions/getMessageInfoEmbed");
const getChannelInfoEmbed_1 = require("../functions/getChannelInfoEmbed");
const getServerInfoEmbed_1 = require("../functions/getServerInfoEmbed");
const utils_2 = require("knub/dist/utils");
const getGuildPreview_1 = require("../functions/getGuildPreview");
const getSnowflakeInfoEmbed_1 = require("../functions/getSnowflakeInfoEmbed");
const getRoleInfoEmbed_1 = require("../functions/getRoleInfoEmbed");
const getEmojiInfoEmbed_1 = require("../functions/getEmojiInfoEmbed");
exports.InfoCmd = types_1.utilityCmd({
    trigger: "info",
    description: "Show information about the specified thing",
    usage: "!info",
    permission: "can_info",
    signature: {
        value: commandTypes_1.commandTypeHelpers.string({ required: false }),
        compact: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "c" }),
    },
    async run({ message, args, pluginData }) {
        const value = args.value || message.author.id;
        const userCfg = await pluginData.config.getMatchingConfig({
            member: message.member,
            channelId: message.channel.id,
            message,
        });
        // 1. Channel
        if (userCfg.can_channelinfo) {
            const channelId = utils_2.getChannelId(value);
            const channel = channelId && pluginData.guild.channels.get(channelId);
            if (channel) {
                const embed = await getChannelInfoEmbed_1.getChannelInfoEmbed(pluginData, channelId, message.author.id);
                if (embed) {
                    message.channel.createMessage({ embed });
                    return;
                }
            }
        }
        // 2. Server
        if (userCfg.can_server) {
            const guild = pluginData.client.guilds.get(value);
            if (guild) {
                const embed = await getServerInfoEmbed_1.getServerInfoEmbed(pluginData, value, message.author.id);
                if (embed) {
                    message.channel.createMessage({ embed });
                    return;
                }
            }
        }
        // 3. User
        if (userCfg.can_userinfo) {
            const user = await utils_1.resolveUser(pluginData.client, value);
            if (user && userCfg.can_userinfo) {
                const embed = await getUserInfoEmbed_1.getUserInfoEmbed(pluginData, user.id, Boolean(args.compact), message.author.id);
                if (embed) {
                    message.channel.createMessage({ embed });
                    return;
                }
            }
        }
        // 4. Message
        if (userCfg.can_messageinfo) {
            const messageTarget = await resolveMessageTarget_1.resolveMessageTarget(pluginData, value);
            if (messageTarget) {
                if (canReadChannel_1.canReadChannel(messageTarget.channel, message.member)) {
                    const embed = await getMessageInfoEmbed_1.getMessageInfoEmbed(pluginData, messageTarget.channel.id, messageTarget.messageId, message.author.id);
                    if (embed) {
                        message.channel.createMessage({ embed });
                        return;
                    }
                }
            }
        }
        // 5. Invite
        if (userCfg.can_inviteinfo) {
            const inviteCode = utils_1.parseInviteCodeInput(value) ?? value;
            if (inviteCode) {
                const invite = await utils_1.resolveInvite(pluginData.client, inviteCode, true);
                if (invite) {
                    const embed = await getInviteInfoEmbed_1.getInviteInfoEmbed(pluginData, inviteCode);
                    if (embed) {
                        message.channel.createMessage({ embed });
                        return;
                    }
                }
            }
        }
        // 6. Server again (fallback for discovery servers)
        if (userCfg.can_server) {
            const serverPreview = getGuildPreview_1.getGuildPreview(pluginData.client, value).catch(() => null);
            if (serverPreview) {
                const embed = await getServerInfoEmbed_1.getServerInfoEmbed(pluginData, value, message.author.id);
                if (embed) {
                    message.channel.createMessage({ embed });
                    return;
                }
            }
        }
        // 7. Role
        if (userCfg.can_roleinfo) {
            const roleId = utils_2.getRoleId(value);
            const role = roleId && pluginData.guild.roles.get(roleId);
            if (role) {
                const embed = await getRoleInfoEmbed_1.getRoleInfoEmbed(pluginData, role, message.author.id);
                message.channel.createMessage({ embed });
                return;
            }
        }
        // 8. Emoji
        if (userCfg.can_emojiinfo) {
            const emojiIdMatch = value.match(utils_1.customEmojiRegex);
            if (emojiIdMatch?.[2]) {
                const embed = await getEmojiInfoEmbed_1.getEmojiInfoEmbed(pluginData, emojiIdMatch[2]);
                if (embed) {
                    message.channel.createMessage({ embed });
                    return;
                }
            }
        }
        // 9. Arbitrary ID
        if (utils_1.isValidSnowflake(value) && userCfg.can_snowflake) {
            const embed = await getSnowflakeInfoEmbed_1.getSnowflakeInfoEmbed(pluginData, value, true, message.author.id);
            message.channel.createMessage({ embed });
            return;
        }
        // 10. No can do
        pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Could not find anything with that value or you are lacking permission for the snowflake type");
    },
});
