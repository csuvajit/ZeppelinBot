"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildLogs_1 = require("../../data/GuildLogs");
const GuildCases_1 = require("../../data/GuildCases");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildArchives_1 = require("../../data/GuildArchives");
const Supporters_1 = require("../../data/Supporters");
const ServerInfoCmd_1 = require("./commands/ServerInfoCmd");
const RolesCmd_1 = require("./commands/RolesCmd");
const LevelCmd_1 = require("./commands/LevelCmd");
const SearchCmd_1 = require("./commands/SearchCmd");
const BanSearchCmd_1 = require("./commands/BanSearchCmd");
const UserInfoCmd_1 = require("./commands/UserInfoCmd");
const NicknameResetCmd_1 = require("./commands/NicknameResetCmd");
const NicknameCmd_1 = require("./commands/NicknameCmd");
const PingCmd_1 = require("./commands/PingCmd");
const SourceCmd_1 = require("./commands/SourceCmd");
const ContextCmd_1 = require("./commands/ContextCmd");
const VcmoveCmd_1 = require("./commands/VcmoveCmd");
const HelpCmd_1 = require("./commands/HelpCmd");
const AboutCmd_1 = require("./commands/AboutCmd");
const guildReloads_1 = require("./guildReloads");
const pluginUtils_1 = require("../../pluginUtils");
const ReloadGuildCmd_1 = require("./commands/ReloadGuildCmd");
const JumboCmd_1 = require("./commands/JumboCmd");
const AvatarCmd_1 = require("./commands/AvatarCmd");
const CleanCmd_1 = require("./commands/CleanCmd");
const InviteInfoCmd_1 = require("./commands/InviteInfoCmd");
const ChannelInfoCmd_1 = require("./commands/ChannelInfoCmd");
const MessageInfoCmd_1 = require("./commands/MessageInfoCmd");
const InfoCmd_1 = require("./commands/InfoCmd");
const SnowflakeInfoCmd_1 = require("./commands/SnowflakeInfoCmd");
const regExpRunners_1 = require("../../regExpRunners");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const VcdisconnectCmd_1 = require("./commands/VcdisconnectCmd");
const ModActionsPlugin_1 = require("../ModActions/ModActionsPlugin");
const refreshMembers_1 = require("./refreshMembers");
const RoleInfoCmd_1 = require("./commands/RoleInfoCmd");
const EmojiInfoCmd_1 = require("./commands/EmojiInfoCmd");
const defaultOptions = {
    config: {
        can_roles: false,
        can_level: false,
        can_search: false,
        can_clean: false,
        can_info: false,
        can_server: false,
        can_inviteinfo: false,
        can_channelinfo: false,
        can_messageinfo: false,
        can_userinfo: false,
        can_roleinfo: false,
        can_emojiinfo: false,
        can_snowflake: false,
        can_reload_guild: false,
        can_nickname: false,
        can_ping: false,
        can_source: false,
        can_vcmove: false,
        can_vckick: false,
        can_help: false,
        can_about: false,
        can_context: false,
        can_jumbo: false,
        jumbo_size: 128,
        can_avatar: false,
        info_on_single_result: true,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_roles: true,
                can_level: true,
                can_search: true,
                can_clean: true,
                can_info: true,
                can_server: true,
                can_inviteinfo: true,
                can_channelinfo: true,
                can_messageinfo: true,
                can_userinfo: true,
                can_roleinfo: true,
                can_emojiinfo: true,
                can_snowflake: true,
                can_nickname: true,
                can_vcmove: true,
                can_vckick: true,
                can_help: true,
                can_context: true,
                can_jumbo: true,
                can_avatar: true,
                can_source: true,
            },
        },
        {
            level: ">=100",
            config: {
                can_reload_guild: true,
                can_ping: true,
                can_about: true,
            },
        },
    ],
};
exports.UtilityPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "utility",
    showInDocs: true,
    info: {
        prettyName: "Utility",
    },
    dependencies: [TimeAndDatePlugin_1.TimeAndDatePlugin, ModActionsPlugin_1.ModActionsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        SearchCmd_1.SearchCmd,
        BanSearchCmd_1.BanSearchCmd,
        UserInfoCmd_1.UserInfoCmd,
        LevelCmd_1.LevelCmd,
        RolesCmd_1.RolesCmd,
        ServerInfoCmd_1.ServerInfoCmd,
        NicknameResetCmd_1.NicknameResetCmd,
        NicknameCmd_1.NicknameCmd,
        PingCmd_1.PingCmd,
        SourceCmd_1.SourceCmd,
        ContextCmd_1.ContextCmd,
        VcmoveCmd_1.VcmoveCmd,
        VcdisconnectCmd_1.VcdisconnectCmd,
        VcmoveCmd_1.VcmoveAllCmd,
        HelpCmd_1.HelpCmd,
        AboutCmd_1.AboutCmd,
        ReloadGuildCmd_1.ReloadGuildCmd,
        JumboCmd_1.JumboCmd,
        AvatarCmd_1.AvatarCmd,
        CleanCmd_1.CleanCmd,
        InviteInfoCmd_1.InviteInfoCmd,
        ChannelInfoCmd_1.ChannelInfoCmd,
        MessageInfoCmd_1.MessageInfoCmd,
        InfoCmd_1.InfoCmd,
        SnowflakeInfoCmd_1.SnowflakeInfoCmd,
        RoleInfoCmd_1.RoleInfoCmd,
        EmojiInfoCmd_1.EmojiInfoCmd,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
        state.cases = GuildCases_1.GuildCases.getGuildInstance(guild.id);
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.archives = GuildArchives_1.GuildArchives.getGuildInstance(guild.id);
        state.supporters = new Supporters_1.Supporters();
        state.regexRunner = regExpRunners_1.getRegExpRunner(`guild-${pluginData.guild.id}`);
        state.lastReload = Date.now();
        // FIXME: Temp fix for role change detection for specific servers, load all guild members in the background on bot start
        const roleChangeDetectionFixServers = [
            "786212572285763605",
            "653681924384096287",
            "493351982887862283",
            "513338222810497041",
            "523043978178723840",
            "718076393295970376",
            "803251072877199400",
            "750492934343753798",
        ];
        if (roleChangeDetectionFixServers.includes(pluginData.guild.id)) {
            refreshMembers_1.refreshMembersIfNeeded(pluginData.guild);
        }
    },
    afterLoad(pluginData) {
        const { guild } = pluginData;
        if (guildReloads_1.activeReloads.has(guild.id)) {
            pluginUtils_1.sendSuccessMessage(pluginData, guildReloads_1.activeReloads.get(guild.id), "Reloaded!");
            guildReloads_1.activeReloads.delete(guild.id);
        }
    },
    beforeUnload(pluginData) {
        regExpRunners_1.discardRegExpRunner(`guild-${pluginData.guild.id}`);
    },
});
