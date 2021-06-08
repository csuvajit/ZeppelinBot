"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoReactionsPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const NewAutoReactionsCmd_1 = require("./commands/NewAutoReactionsCmd");
const DisableAutoReactionsCmd_1 = require("./commands/DisableAutoReactionsCmd");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildAutoReactions_1 = require("../../data/GuildAutoReactions");
const AddReactionsEvt_1 = require("./events/AddReactionsEvt");
const utils_1 = require("../../utils");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const defaultOptions = {
    config: {
        can_manage: false,
    },
    overrides: [
        {
            level: ">=100",
            config: {
                can_manage: true,
            },
        },
    ],
};
exports.AutoReactionsPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "auto_reactions",
    showInDocs: true,
    info: {
        prettyName: "Auto-reactions",
        description: utils_1.trimPluginDescription(`
      Allows setting up automatic reactions to all new messages on a channel
    `),
    },
    dependencies: [LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        NewAutoReactionsCmd_1.NewAutoReactionsCmd,
        DisableAutoReactionsCmd_1.DisableAutoReactionsCmd,
    ],
    // prettier-ignore
    events: [
        AddReactionsEvt_1.AddReactionsEvt,
    ],
    beforeLoad(pluginData) {
        pluginData.state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(pluginData.guild.id);
        pluginData.state.autoReactions = GuildAutoReactions_1.GuildAutoReactions.getGuildInstance(pluginData.guild.id);
    },
});
