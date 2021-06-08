"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CensorPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildLogs_1 = require("../../data/GuildLogs");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const onMessageCreate_1 = require("./util/onMessageCreate");
const onMessageUpdate_1 = require("./util/onMessageUpdate");
const utils_1 = require("../../utils");
const regExpRunners_1 = require("../../regExpRunners");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const defaultOptions = {
    config: {
        filter_zalgo: false,
        filter_invites: false,
        invite_guild_whitelist: null,
        invite_guild_blacklist: null,
        invite_code_whitelist: null,
        invite_code_blacklist: null,
        allow_group_dm_invites: false,
        filter_domains: false,
        domain_whitelist: null,
        domain_blacklist: null,
        blocked_tokens: null,
        blocked_words: null,
        blocked_regex: null,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                filter_zalgo: false,
                filter_invites: false,
                filter_domains: false,
                blocked_tokens: null,
                blocked_words: null,
                blocked_regex: null,
            },
        },
    ],
};
exports.CensorPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "censor",
    showInDocs: true,
    info: {
        prettyName: "Censor",
        description: utils_1.trimPluginDescription(`
      Censor words, tokens, links, regex, etc.
      For more advanced filtering, check out the Automod plugin!
    `),
    },
    dependencies: [LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.serverLogs = new GuildLogs_1.GuildLogs(guild.id);
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.regexRunner = regExpRunners_1.getRegExpRunner(`guild-${pluginData.guild.id}`);
    },
    afterLoad(pluginData) {
        const { state, guild } = pluginData;
        state.onMessageCreateFn = msg => onMessageCreate_1.onMessageCreate(pluginData, msg);
        state.savedMessages.events.on("create", state.onMessageCreateFn);
        state.onMessageUpdateFn = msg => onMessageUpdate_1.onMessageUpdate(pluginData, msg);
        state.savedMessages.events.on("update", state.onMessageUpdateFn);
    },
    beforeUnload(pluginData) {
        regExpRunners_1.discardRegExpRunner(`guild-${pluginData.guild.id}`);
        pluginData.state.savedMessages.events.off("create", pluginData.state.onMessageCreateFn);
        pluginData.state.savedMessages.events.off("update", pluginData.state.onMessageUpdateFn);
    },
});
