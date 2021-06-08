"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const DefaultLogMessages_json_1 = __importDefault(require("../../data/DefaultLogMessages.json"));
const GuildLogs_1 = require("../../data/GuildLogs");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildArchives_1 = require("../../data/GuildArchives");
const GuildCases_1 = require("../../data/GuildCases");
const onMessageDelete_1 = require("./util/onMessageDelete");
const onMessageDeleteBulk_1 = require("./util/onMessageDeleteBulk");
const onMessageUpdate_1 = require("./util/onMessageUpdate");
const LogsGuildMemberAddEvt_1 = require("./events/LogsGuildMemberAddEvt");
const LogsGuildMemberRemoveEvt_1 = require("./events/LogsGuildMemberRemoveEvt");
const LogsUserUpdateEvts_1 = require("./events/LogsUserUpdateEvts");
const LogsChannelModifyEvts_1 = require("./events/LogsChannelModifyEvts");
const LogsRoleModifyEvts_1 = require("./events/LogsRoleModifyEvts");
const LogsVoiceChannelEvts_1 = require("./events/LogsVoiceChannelEvts");
const log_1 = require("./util/log");
const LogType_1 = require("../../data/LogType");
const getLogMessage_1 = require("./util/getLogMessage");
const regExpRunners_1 = require("../../regExpRunners");
const utils_1 = require("../../utils");
const logger_1 = require("../../logger");
const CasesPlugin_1 = require("../Cases/CasesPlugin");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const defaultOptions = {
    config: {
        channels: {},
        format: {
            timestamp: types_1.FORMAT_NO_TIMESTAMP,
            ...DefaultLogMessages_json_1.default,
        },
        ping_user: true,
        allow_user_mentions: false,
        timestamp_format: "YYYY-MM-DD HH:mm:ss z",
        include_embed_timestamp: true,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                ping_user: false,
            },
        },
    ],
};
exports.LogsPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "logs",
    showInDocs: true,
    info: {
        prettyName: "Logs",
    },
    dependencies: [TimeAndDatePlugin_1.TimeAndDatePlugin, CasesPlugin_1.CasesPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    events: [
        LogsGuildMemberAddEvt_1.LogsGuildMemberAddEvt,
        LogsGuildMemberRemoveEvt_1.LogsGuildMemberRemoveEvt,
        LogsUserUpdateEvts_1.LogsGuildMemberUpdateEvt,
        LogsChannelModifyEvts_1.LogsChannelCreateEvt,
        LogsChannelModifyEvts_1.LogsChannelDeleteEvt,
        LogsRoleModifyEvts_1.LogsRoleCreateEvt,
        LogsRoleModifyEvts_1.LogsRoleDeleteEvt,
        LogsVoiceChannelEvts_1.LogsVoiceJoinEvt,
        LogsVoiceChannelEvts_1.LogsVoiceLeaveEvt,
        LogsVoiceChannelEvts_1.LogsVoiceSwitchEvt,
    ],
    public: {
        log(pluginData) {
            return (type, data) => {
                return log_1.log(pluginData, type, data);
            };
        },
        getLogMessage(pluginData) {
            return (type, data) => {
                return getLogMessage_1.getLogMessage(pluginData, type, data);
            };
        },
    },
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.guildLogs = new GuildLogs_1.GuildLogs(guild.id);
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.archives = GuildArchives_1.GuildArchives.getGuildInstance(guild.id);
        state.cases = GuildCases_1.GuildCases.getGuildInstance(guild.id);
        state.batches = new Map();
        state.regexRunner = regExpRunners_1.getRegExpRunner(`guild-${pluginData.guild.id}`);
    },
    afterLoad(pluginData) {
        const { state, guild } = pluginData;
        state.logListener = ({ type, data }) => log_1.log(pluginData, type, data);
        state.guildLogs.on("log", state.logListener);
        state.onMessageDeleteFn = msg => onMessageDelete_1.onMessageDelete(pluginData, msg);
        state.savedMessages.events.on("delete", state.onMessageDeleteFn);
        state.onMessageDeleteBulkFn = msg => onMessageDeleteBulk_1.onMessageDeleteBulk(pluginData, msg);
        state.savedMessages.events.on("deleteBulk", state.onMessageDeleteBulkFn);
        state.onMessageUpdateFn = (newMsg, oldMsg) => onMessageUpdate_1.onMessageUpdate(pluginData, newMsg, oldMsg);
        state.savedMessages.events.on("update", state.onMessageUpdateFn);
        state.regexRunnerRepeatedTimeoutListener = (regexSource, timeoutMs, failedTimes) => {
            logger_1.logger.warn(`Disabled heavy regex temporarily: ${regexSource}`);
            log_1.log(pluginData, LogType_1.LogType.BOT_ALERT, {
                body: `
            The following regex has taken longer than ${timeoutMs}ms for ${failedTimes} times and has been temporarily disabled:
          `.trim() +
                    "\n```" +
                    utils_1.disableCodeBlocks(regexSource) +
                    "```",
            });
        };
        state.regexRunner.on("repeatedTimeout", state.regexRunnerRepeatedTimeoutListener);
    },
    beforeUnload(pluginData) {
        pluginData.state.guildLogs.removeListener("log", pluginData.state.logListener);
        pluginData.state.savedMessages.events.off("delete", pluginData.state.onMessageDeleteFn);
        pluginData.state.savedMessages.events.off("deleteBulk", pluginData.state.onMessageDeleteBulkFn);
        pluginData.state.savedMessages.events.off("update", pluginData.state.onMessageUpdateFn);
        pluginData.state.regexRunner.off("repeatedTimeout", pluginData.state.regexRunnerRepeatedTimeoutListener);
        regExpRunners_1.discardRegExpRunner(`guild-${pluginData.guild.id}`);
    },
});
