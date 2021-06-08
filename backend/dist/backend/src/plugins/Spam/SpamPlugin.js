"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpamPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildLogs_1 = require("../../data/GuildLogs");
const GuildArchives_1 = require("../../data/GuildArchives");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildMutes_1 = require("../../data/GuildMutes");
const onMessageCreate_1 = require("./util/onMessageCreate");
const clearOldRecentActions_1 = require("./util/clearOldRecentActions");
const SpamVoiceEvt_1 = require("./events/SpamVoiceEvt");
const utils_1 = require("../../utils");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const defaultOptions = {
    config: {
        max_censor: null,
        max_messages: null,
        max_mentions: null,
        max_links: null,
        max_attachments: null,
        max_emojis: null,
        max_newlines: null,
        max_duplicates: null,
        max_characters: null,
        max_voice_moves: null,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                max_messages: null,
                max_mentions: null,
                max_links: null,
                max_attachments: null,
                max_emojis: null,
                max_newlines: null,
                max_duplicates: null,
                max_characters: null,
                max_voice_moves: null,
            },
        },
    ],
};
exports.SpamPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "spam",
    showInDocs: true,
    info: {
        prettyName: "Spam protection",
        description: utils_1.trimPluginDescription(`
      Basic spam detection and auto-muting.
      For more advanced spam filtering, check out the Automod plugin!
    `),
    },
    dependencies: [LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    events: [
        SpamVoiceEvt_1.SpamVoiceJoinEvt,
        SpamVoiceEvt_1.SpamVoiceSwitchEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
        state.archives = GuildArchives_1.GuildArchives.getGuildInstance(guild.id);
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.mutes = GuildMutes_1.GuildMutes.getGuildInstance(guild.id);
        state.recentActions = [];
        state.lastHandledMsgIds = new Map();
        state.spamDetectionQueue = Promise.resolve();
    },
    afterLoad(pluginData) {
        const { state } = pluginData;
        state.expiryInterval = setInterval(() => clearOldRecentActions_1.clearOldRecentActions(pluginData), 1000 * 60);
        state.onMessageCreateFn = msg => onMessageCreate_1.onMessageCreate(pluginData, msg);
        state.savedMessages.events.on("create", state.onMessageCreateFn);
    },
    beforeUnload(pluginData) {
        pluginData.state.savedMessages.events.off("create", pluginData.state.onMessageCreateFn);
        clearInterval(pluginData.state.expiryInterval);
    },
});
