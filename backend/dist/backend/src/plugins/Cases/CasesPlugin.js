"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const createCase_1 = require("./functions/createCase");
const GuildLogs_1 = require("../../data/GuildLogs");
const GuildArchives_1 = require("../../data/GuildArchives");
const GuildCases_1 = require("../../data/GuildCases");
const createCaseNote_1 = require("./functions/createCaseNote");
const postToCaseLogChannel_1 = require("./functions/postToCaseLogChannel");
const getCaseTypeAmountForUserId_1 = require("./functions/getCaseTypeAmountForUserId");
const getCaseEmbed_1 = require("./functions/getCaseEmbed");
const utils_1 = require("../../utils");
const getCaseSummary_1 = require("./functions/getCaseSummary");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const pluginUtils_1 = require("../../pluginUtils");
const getTotalCasesByMod_1 = require("./functions/getTotalCasesByMod");
const getRecentCasesByMod_1 = require("./functions/getRecentCasesByMod");
const defaultOptions = {
    config: {
        log_automatic_actions: true,
        case_log_channel: null,
        show_relative_times: true,
        relative_time_cutoff: "7d",
        case_colors: null,
        case_icons: null,
    },
};
exports.CasesPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "cases",
    showInDocs: true,
    info: {
        prettyName: "Cases",
        description: utils_1.trimPluginDescription(`
      This plugin contains basic configuration for cases created by other plugins
    `),
    },
    dependencies: [TimeAndDatePlugin_1.TimeAndDatePlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    public: {
        createCase(pluginData) {
            return (args) => {
                return createCase_1.createCase(pluginData, args);
            };
        },
        createCaseNote(pluginData) {
            return (args) => {
                return createCaseNote_1.createCaseNote(pluginData, args);
            };
        },
        postCaseToCaseLogChannel(pluginData) {
            return (caseOrCaseId) => {
                return postToCaseLogChannel_1.postCaseToCaseLogChannel(pluginData, caseOrCaseId);
            };
        },
        getCaseTypeAmountForUserId(pluginData) {
            return (userID, type) => {
                return getCaseTypeAmountForUserId_1.getCaseTypeAmountForUserId(pluginData, userID, type);
            };
        },
        getTotalCasesByMod: pluginUtils_1.mapToPublicFn(getTotalCasesByMod_1.getTotalCasesByMod),
        getRecentCasesByMod: pluginUtils_1.mapToPublicFn(getRecentCasesByMod_1.getRecentCasesByMod),
        getCaseEmbed: pluginUtils_1.mapToPublicFn(getCaseEmbed_1.getCaseEmbed),
        getCaseSummary: pluginUtils_1.mapToPublicFn(getCaseSummary_1.getCaseSummary),
    },
    afterLoad(pluginData) {
        pluginData.state.logs = new GuildLogs_1.GuildLogs(pluginData.guild.id);
        pluginData.state.archives = GuildArchives_1.GuildArchives.getGuildInstance(pluginData.guild.id);
        pluginData.state.cases = GuildCases_1.GuildCases.getGuildInstance(pluginData.guild.id);
    },
});
