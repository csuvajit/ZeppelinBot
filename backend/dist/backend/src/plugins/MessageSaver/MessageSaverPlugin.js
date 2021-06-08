"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSaverPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const SaveMessagesEvts_1 = require("./events/SaveMessagesEvts");
const SaveMessagesToDB_1 = require("./commands/SaveMessagesToDB");
const SavePinsToDB_1 = require("./commands/SavePinsToDB");
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
exports.MessageSaverPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "message_saver",
    showInDocs: false,
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        SaveMessagesToDB_1.SaveMessagesToDBCmd,
        SavePinsToDB_1.SavePinsToDBCmd,
    ],
    // prettier-ignore
    events: [
        SaveMessagesEvts_1.MessageCreateEvt,
        SaveMessagesEvts_1.MessageUpdateEvt,
        SaveMessagesEvts_1.MessageDeleteEvt,
        SaveMessagesEvts_1.MessageDeleteBulkEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
    },
});
