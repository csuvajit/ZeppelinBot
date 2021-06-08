"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameHistoryPlugin = void 0;
const types_1 = require("./types");
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const GuildNicknameHistory_1 = require("../../data/GuildNicknameHistory");
const UsernameHistory_1 = require("../../data/UsernameHistory");
const Queue_1 = require("../../Queue");
const NamesCmd_1 = require("./commands/NamesCmd");
const UpdateNameEvts_1 = require("./events/UpdateNameEvts");
const defaultOptions = {
    config: {
        can_view: false,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_view: true,
            },
        },
    ],
};
exports.NameHistoryPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "name_history",
    showInDocs: false,
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        NamesCmd_1.NamesCmd,
    ],
    // prettier-ignore
    events: [
        UpdateNameEvts_1.ChannelJoinEvt,
        UpdateNameEvts_1.MessageCreateEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.nicknameHistory = GuildNicknameHistory_1.GuildNicknameHistory.getGuildInstance(guild.id);
        state.usernameHistory = new UsernameHistory_1.UsernameHistory();
        state.updateQueue = new Queue_1.Queue();
    },
});
