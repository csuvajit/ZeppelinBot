"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModActionsPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const CasesPlugin_1 = require("../Cases/CasesPlugin");
const MutesPlugin_1 = require("../Mutes/MutesPlugin");
const types_1 = require("./types");
const CreateBanCaseOnManualBanEvt_1 = require("./events/CreateBanCaseOnManualBanEvt");
const CreateUnbanCaseOnManualUnbanEvt_1 = require("./events/CreateUnbanCaseOnManualUnbanEvt");
const CreateKickCaseOnManualKickEvt_1 = require("./events/CreateKickCaseOnManualKickEvt");
const UpdateCmd_1 = require("./commands/UpdateCmd");
const NoteCmd_1 = require("./commands/NoteCmd");
const WarnCmd_1 = require("./commands/WarnCmd");
const MuteCmd_1 = require("./commands/MuteCmd");
const PostAlertOnMemberJoinEvt_1 = require("./events/PostAlertOnMemberJoinEvt");
const ForcemuteCmd_1 = require("./commands/ForcemuteCmd");
const UnmuteCmd_1 = require("./commands/UnmuteCmd");
const KickCmd_1 = require("./commands/KickCmd");
const SoftbanCommand_1 = require("./commands/SoftbanCommand");
const BanCmd_1 = require("./commands/BanCmd");
const UnbanCmd_1 = require("./commands/UnbanCmd");
const ForcebanCmd_1 = require("./commands/ForcebanCmd");
const MassUnbanCmd_1 = require("./commands/MassUnbanCmd");
const MassBanCmd_1 = require("./commands/MassBanCmd");
const AddCaseCmd_1 = require("./commands/AddCaseCmd");
const CaseCmd_1 = require("./commands/CaseCmd");
const CasesUserCmd_1 = require("./commands/CasesUserCmd");
const CasesModCmd_1 = require("./commands/CasesModCmd");
const HideCaseCmd_1 = require("./commands/HideCaseCmd");
const UnhideCaseCmd_1 = require("./commands/UnhideCaseCmd");
const GuildMutes_1 = require("../../data/GuildMutes");
const GuildCases_1 = require("../../data/GuildCases");
const GuildLogs_1 = require("../../data/GuildLogs");
const ForceunmuteCmd_1 = require("./commands/ForceunmuteCmd");
const warnMember_1 = require("./functions/warnMember");
const kickMember_1 = require("./functions/kickMember");
const banUserId_1 = require("./functions/banUserId");
const MassmuteCmd_1 = require("./commands/MassmuteCmd");
const utils_1 = require("../../utils");
const DeleteCaseCmd_1 = require("./commands/DeleteCaseCmd");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const GuildTempbans_1 = require("../../data/GuildTempbans");
const outdatedTempbansLoop_1 = require("./functions/outdatedTempbansLoop");
const events_1 = require("events");
const pluginUtils_1 = require("../../pluginUtils");
const onModActionsEvent_1 = require("./functions/onModActionsEvent");
const offModActionsEvent_1 = require("./functions/offModActionsEvent");
const updateCase_1 = require("./functions/updateCase");
const Queue_1 = require("../../Queue");
const defaultOptions = {
    config: {
        dm_on_warn: true,
        dm_on_kick: false,
        dm_on_ban: false,
        message_on_warn: false,
        message_on_kick: false,
        message_on_ban: false,
        message_channel: null,
        warn_message: "You have received a warning on the {guildName} server: {reason}",
        kick_message: "You have been kicked from the {guildName} server. Reason given: {reason}",
        ban_message: "You have been banned from the {guildName} server. Reason given: {reason}",
        tempban_message: "You have been banned from the {guildName} server for {banTime}. Reason given: {reason}",
        alert_on_rejoin: false,
        alert_channel: null,
        warn_notify_enabled: false,
        warn_notify_threshold: 5,
        warn_notify_message: "The user already has **{priorWarnings}** warnings!\n Please check their prior cases and assess whether or not to warn anyways.\n Proceed with the warning?",
        ban_delete_message_days: 1,
        can_note: false,
        can_warn: false,
        can_mute: false,
        can_kick: false,
        can_ban: false,
        can_unban: false,
        can_view: false,
        can_addcase: false,
        can_massunban: false,
        can_massban: false,
        can_massmute: false,
        can_hidecase: false,
        can_deletecase: false,
        can_act_as_other: false,
        create_cases_for_manual_actions: true,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_note: true,
                can_warn: true,
                can_mute: true,
                can_kick: true,
                can_ban: true,
                can_unban: true,
                can_view: true,
                can_addcase: true,
            },
        },
        {
            level: ">=100",
            config: {
                can_massunban: true,
                can_massban: true,
                can_massmute: true,
                can_hidecase: true,
                can_act_as_other: true,
            },
        },
    ],
};
exports.ModActionsPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "mod_actions",
    showInDocs: true,
    info: {
        prettyName: "Mod actions",
        description: utils_1.trimPluginDescription(`
      This plugin contains the 'typical' mod actions such as warning, muting, kicking, banning, etc.
    `),
    },
    dependencies: [TimeAndDatePlugin_1.TimeAndDatePlugin, CasesPlugin_1.CasesPlugin, MutesPlugin_1.MutesPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    events: [
        CreateBanCaseOnManualBanEvt_1.CreateBanCaseOnManualBanEvt,
        CreateUnbanCaseOnManualUnbanEvt_1.CreateUnbanCaseOnManualUnbanEvt,
        CreateKickCaseOnManualKickEvt_1.CreateKickCaseOnManualKickEvt,
        PostAlertOnMemberJoinEvt_1.PostAlertOnMemberJoinEvt,
    ],
    commands: [
        UpdateCmd_1.UpdateCmd,
        NoteCmd_1.NoteCmd,
        WarnCmd_1.WarnCmd,
        MuteCmd_1.MuteCmd,
        ForcemuteCmd_1.ForcemuteCmd,
        UnmuteCmd_1.UnmuteCmd,
        ForceunmuteCmd_1.ForceUnmuteCmd,
        KickCmd_1.KickCmd,
        SoftbanCommand_1.SoftbanCmd,
        BanCmd_1.BanCmd,
        UnbanCmd_1.UnbanCmd,
        ForcebanCmd_1.ForcebanCmd,
        MassBanCmd_1.MassbanCmd,
        MassmuteCmd_1.MassmuteCmd,
        MassUnbanCmd_1.MassunbanCmd,
        AddCaseCmd_1.AddCaseCmd,
        CaseCmd_1.CaseCmd,
        CasesUserCmd_1.CasesUserCmd,
        CasesModCmd_1.CasesModCmd,
        HideCaseCmd_1.HideCaseCmd,
        UnhideCaseCmd_1.UnhideCaseCmd,
        DeleteCaseCmd_1.DeleteCaseCmd,
    ],
    public: {
        warnMember(pluginData) {
            return (member, reason, warnOptions) => {
                warnMember_1.warnMember(pluginData, member, reason, warnOptions);
            };
        },
        kickMember(pluginData) {
            return (member, reason, kickOptions) => {
                kickMember_1.kickMember(pluginData, member, reason, kickOptions);
            };
        },
        banUserId(pluginData) {
            return (userId, reason, banOptions, banTime) => {
                banUserId_1.banUserId(pluginData, userId, reason, banOptions, banTime);
            };
        },
        updateCase(pluginData) {
            return (msg, caseNumber, note) => {
                updateCase_1.updateCase(pluginData, msg, { caseNumber, note });
            };
        },
        on: pluginUtils_1.mapToPublicFn(onModActionsEvent_1.onModActionsEvent),
        off: pluginUtils_1.mapToPublicFn(offModActionsEvent_1.offModActionsEvent),
        getEventEmitter(pluginData) {
            return () => pluginData.state.events;
        },
    },
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.mutes = GuildMutes_1.GuildMutes.getGuildInstance(guild.id);
        state.cases = GuildCases_1.GuildCases.getGuildInstance(guild.id);
        state.tempbans = GuildTempbans_1.GuildTempbans.getGuildInstance(guild.id);
        state.serverLogs = new GuildLogs_1.GuildLogs(guild.id);
        state.unloaded = false;
        state.outdatedTempbansTimeout = null;
        state.ignoredEvents = [];
        // Massbans can take a while depending on rate limits,
        // so we're giving each massban 15 minutes to complete before launching the next massban
        state.massbanQueue = new Queue_1.Queue(15 * utils_1.MINUTES);
        state.events = new events_1.EventEmitter();
    },
    afterLoad(pluginData) {
        outdatedTempbansLoop_1.outdatedTempbansLoop(pluginData);
    },
    beforeUnload(pluginData) {
        pluginData.state.unloaded = true;
        pluginData.state.events.removeAllListeners();
    },
});
