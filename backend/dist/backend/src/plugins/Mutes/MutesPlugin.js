"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutesPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const CasesPlugin_1 = require("../Cases/CasesPlugin");
const GuildMutes_1 = require("../../data/GuildMutes");
const GuildCases_1 = require("../../data/GuildCases");
const GuildLogs_1 = require("../../data/GuildLogs");
const GuildArchives_1 = require("../../data/GuildArchives");
const clearExpiredMutes_1 = require("./functions/clearExpiredMutes");
const MutesCmd_1 = require("./commands/MutesCmd");
const ClearBannedMutesCmd_1 = require("./commands/ClearBannedMutesCmd");
const ClearActiveMuteOnRoleRemovalEvt_1 = require("./events/ClearActiveMuteOnRoleRemovalEvt");
const ClearMutesWithoutRoleCmd_1 = require("./commands/ClearMutesWithoutRoleCmd");
const ClearMutesCmd_1 = require("./commands/ClearMutesCmd");
const muteUser_1 = require("./functions/muteUser");
const unmuteUser_1 = require("./functions/unmuteUser");
const ClearActiveMuteOnMemberBanEvt_1 = require("./events/ClearActiveMuteOnMemberBanEvt");
const ReapplyActiveMuteOnJoinEvt_1 = require("./events/ReapplyActiveMuteOnJoinEvt");
const pluginUtils_1 = require("../../pluginUtils");
const events_1 = require("events");
const onMutesEvent_1 = require("./functions/onMutesEvent");
const offMutesEvent_1 = require("./functions/offMutesEvent");
const defaultOptions = {
    config: {
        mute_role: null,
        move_to_voice_channel: null,
        kick_from_voice_channel: false,
        dm_on_mute: false,
        dm_on_update: false,
        message_on_mute: false,
        message_on_update: false,
        message_channel: null,
        mute_message: "You have been muted on the {guildName} server. Reason given: {reason}",
        timed_mute_message: "You have been muted on the {guildName} server for {time}. Reason given: {reason}",
        update_mute_message: "Your mute on the {guildName} server has been updated to {time}.",
        remove_roles_on_mute: false,
        restore_roles_on_mute: false,
        can_view_list: false,
        can_cleanup: false,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_view_list: true,
            },
        },
        {
            level: ">=100",
            config: {
                can_cleanup: true,
            },
        },
    ],
};
const EXPIRED_MUTE_CHECK_INTERVAL = 60 * 1000;
let FIRST_CHECK_TIME = Date.now();
const FIRST_CHECK_INCREMENT = 5 * 1000;
exports.MutesPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "mutes",
    showInDocs: true,
    info: {
        prettyName: "Mutes",
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    dependencies: [CasesPlugin_1.CasesPlugin],
    // prettier-ignore
    commands: [
        MutesCmd_1.MutesCmd,
        ClearBannedMutesCmd_1.ClearBannedMutesCmd,
        ClearMutesWithoutRoleCmd_1.ClearMutesWithoutRoleCmd,
        ClearMutesCmd_1.ClearMutesCmd,
    ],
    // prettier-ignore
    events: [
        ClearActiveMuteOnRoleRemovalEvt_1.ClearActiveMuteOnRoleRemovalEvt,
        ClearActiveMuteOnMemberBanEvt_1.ClearActiveMuteOnMemberBanEvt,
        ReapplyActiveMuteOnJoinEvt_1.ReapplyActiveMuteOnJoinEvt,
    ],
    public: {
        muteUser: pluginUtils_1.mapToPublicFn(muteUser_1.muteUser),
        unmuteUser: pluginUtils_1.mapToPublicFn(unmuteUser_1.unmuteUser),
        hasMutedRole(pluginData) {
            return (member) => {
                const muteRole = pluginData.config.get().mute_role;
                return muteRole ? member.roles.includes(muteRole) : false;
            };
        },
        on: pluginUtils_1.mapToPublicFn(onMutesEvent_1.onMutesEvent),
        off: pluginUtils_1.mapToPublicFn(offMutesEvent_1.offMutesEvent),
        getEventEmitter(pluginData) {
            return () => pluginData.state.events;
        },
    },
    beforeLoad(pluginData) {
        pluginData.state.mutes = GuildMutes_1.GuildMutes.getGuildInstance(pluginData.guild.id);
        pluginData.state.cases = GuildCases_1.GuildCases.getGuildInstance(pluginData.guild.id);
        pluginData.state.serverLogs = new GuildLogs_1.GuildLogs(pluginData.guild.id);
        pluginData.state.archives = GuildArchives_1.GuildArchives.getGuildInstance(pluginData.guild.id);
        pluginData.state.events = new events_1.EventEmitter();
    },
    afterLoad(pluginData) {
        // Check for expired mutes every 5s
        const firstCheckTime = Math.max(Date.now(), FIRST_CHECK_TIME) + FIRST_CHECK_INCREMENT;
        FIRST_CHECK_TIME = firstCheckTime;
        setTimeout(() => {
            clearExpiredMutes_1.clearExpiredMutes(pluginData);
            pluginData.state.muteClearIntervalId = setInterval(() => clearExpiredMutes_1.clearExpiredMutes(pluginData), EXPIRED_MUTE_CHECK_INTERVAL);
        }, firstCheckTime - Date.now());
    },
    beforeUnload(pluginData) {
        clearInterval(pluginData.state.muteClearIntervalId);
        pluginData.state.events.removeAllListeners();
    },
});
