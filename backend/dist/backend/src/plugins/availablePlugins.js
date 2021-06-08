"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseGuildPlugins = exports.globalPlugins = exports.guildPlugins = void 0;
const UtilityPlugin_1 = require("./Utility/UtilityPlugin");
const LocateUserPlugin_1 = require("./LocateUser/LocateUserPlugin");
const PersistPlugin_1 = require("./Persist/PersistPlugin");
const NameHistoryPlugin_1 = require("./NameHistory/NameHistoryPlugin");
const MessageSaverPlugin_1 = require("./MessageSaver/MessageSaverPlugin");
const AutoReactionsPlugin_1 = require("./AutoReactions/AutoReactionsPlugin");
const RemindersPlugin_1 = require("./Reminders/RemindersPlugin");
const UsernameSaverPlugin_1 = require("./UsernameSaver/UsernameSaverPlugin");
const WelcomeMessagePlugin_1 = require("./WelcomeMessage/WelcomeMessagePlugin");
const PingableRolesPlugin_1 = require("./PingableRoles/PingableRolesPlugin");
const GuildConfigReloaderPlugin_1 = require("./GuildConfigReloader/GuildConfigReloaderPlugin");
const CasesPlugin_1 = require("./Cases/CasesPlugin");
const MutesPlugin_1 = require("./Mutes/MutesPlugin");
const TagsPlugin_1 = require("./Tags/TagsPlugin");
const ModActionsPlugin_1 = require("./ModActions/ModActionsPlugin");
const PostPlugin_1 = require("./Post/PostPlugin");
const AutoDeletePlugin_1 = require("./AutoDelete/AutoDeletePlugin");
const GuildInfoSaverPlugin_1 = require("./GuildInfoSaver/GuildInfoSaverPlugin");
const CensorPlugin_1 = require("./Censor/CensorPlugin");
const RolesPlugin_1 = require("./Roles/RolesPlugin");
const SlowmodePlugin_1 = require("./Slowmode/SlowmodePlugin");
const StarboardPlugin_1 = require("./Starboard/StarboardPlugin");
const ChannelArchiverPlugin_1 = require("./ChannelArchiver/ChannelArchiverPlugin");
const LogsPlugin_1 = require("./Logs/LogsPlugin");
const SelfGrantableRolesPlugin_1 = require("./SelfGrantableRoles/SelfGrantableRolesPlugin");
const SpamPlugin_1 = require("./Spam/SpamPlugin");
const ReactionRolesPlugin_1 = require("./ReactionRoles/ReactionRolesPlugin");
const AutomodPlugin_1 = require("./Automod/AutomodPlugin");
const CompanionChannelsPlugin_1 = require("./CompanionChannels/CompanionChannelsPlugin");
const CustomEventsPlugin_1 = require("./CustomEvents/CustomEventsPlugin");
const BotControlPlugin_1 = require("./BotControl/BotControlPlugin");
const GuildAccessMonitorPlugin_1 = require("./GuildAccessMonitor/GuildAccessMonitorPlugin");
const TimeAndDatePlugin_1 = require("./TimeAndDate/TimeAndDatePlugin");
const CountersPlugin_1 = require("./Counters/CountersPlugin");
// prettier-ignore
exports.guildPlugins = [
    AutoDeletePlugin_1.AutoDeletePlugin,
    AutoReactionsPlugin_1.AutoReactionsPlugin,
    GuildInfoSaverPlugin_1.GuildInfoSaverPlugin,
    CensorPlugin_1.CensorPlugin,
    ChannelArchiverPlugin_1.ChannelArchiverPlugin,
    LocateUserPlugin_1.LocateUserPlugin,
    LogsPlugin_1.LogsPlugin,
    PersistPlugin_1.PersistPlugin,
    PingableRolesPlugin_1.PingableRolesPlugin,
    PostPlugin_1.PostPlugin,
    ReactionRolesPlugin_1.ReactionRolesPlugin,
    MessageSaverPlugin_1.MessageSaverPlugin,
    ModActionsPlugin_1.ModActionsPlugin,
    NameHistoryPlugin_1.NameHistoryPlugin,
    RemindersPlugin_1.RemindersPlugin,
    RolesPlugin_1.RolesPlugin,
    SelfGrantableRolesPlugin_1.SelfGrantableRolesPlugin,
    SlowmodePlugin_1.SlowmodePlugin,
    SpamPlugin_1.SpamPlugin,
    StarboardPlugin_1.StarboardPlugin,
    TagsPlugin_1.TagsPlugin,
    UsernameSaverPlugin_1.UsernameSaverPlugin,
    UtilityPlugin_1.UtilityPlugin,
    WelcomeMessagePlugin_1.WelcomeMessagePlugin,
    CasesPlugin_1.CasesPlugin,
    MutesPlugin_1.MutesPlugin,
    AutomodPlugin_1.AutomodPlugin,
    CompanionChannelsPlugin_1.CompanionChannelsPlugin,
    CustomEventsPlugin_1.CustomEventsPlugin,
    TimeAndDatePlugin_1.TimeAndDatePlugin,
    CountersPlugin_1.CountersPlugin,
];
// prettier-ignore
exports.globalPlugins = [
    GuildConfigReloaderPlugin_1.GuildConfigReloaderPlugin,
    BotControlPlugin_1.BotControlPlugin,
    GuildAccessMonitorPlugin_1.GuildAccessMonitorPlugin,
];
// prettier-ignore
exports.baseGuildPlugins = [
    GuildInfoSaverPlugin_1.GuildInfoSaverPlugin,
    MessageSaverPlugin_1.MessageSaverPlugin,
    NameHistoryPlugin_1.NameHistoryPlugin,
    CasesPlugin_1.CasesPlugin,
    MutesPlugin_1.MutesPlugin,
    TimeAndDatePlugin_1.TimeAndDatePlugin,
];
