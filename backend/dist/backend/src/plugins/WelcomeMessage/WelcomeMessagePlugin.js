"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeMessagePlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildLogs_1 = require("../../data/GuildLogs");
const SendWelcomeMessageEvt_1 = require("./events/SendWelcomeMessageEvt");
const defaultOptions = {
    config: {
        send_dm: false,
        send_to_channel: null,
        message: null,
    },
};
exports.WelcomeMessagePlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "welcome_message",
    showInDocs: true,
    info: {
        prettyName: "Welcome message",
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    events: [
        SendWelcomeMessageEvt_1.SendWelcomeMessageEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
        state.sentWelcomeMessages = new Set();
    },
});
