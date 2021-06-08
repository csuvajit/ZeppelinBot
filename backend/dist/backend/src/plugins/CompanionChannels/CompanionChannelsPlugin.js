"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanionChannelsPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const VoiceChannelJoinEvt_1 = require("./events/VoiceChannelJoinEvt");
const VoiceChannelSwitchEvt_1 = require("./events/VoiceChannelSwitchEvt");
const VoiceChannelLeaveEvt_1 = require("./events/VoiceChannelLeaveEvt");
const utils_1 = require("../../utils");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const knub_1 = require("knub");
const defaultOptions = {
    config: {
        entries: {},
    },
};
exports.CompanionChannelsPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "companion_channels",
    showInDocs: true,
    info: {
        prettyName: "Companion channels",
        description: utils_1.trimPluginDescription(`
      Set up 'companion channels' between text and voice channels.
      Once set up, any time a user joins one of the specified voice channels,
      they'll get channel permissions applied to them for the text channels.
    `),
    },
    dependencies: [LogsPlugin_1.LogsPlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    events: [VoiceChannelJoinEvt_1.VoiceChannelJoinEvt, VoiceChannelSwitchEvt_1.VoiceChannelSwitchEvt, VoiceChannelLeaveEvt_1.VoiceChannelLeaveEvt],
    beforeLoad(pluginData) {
        pluginData.state.errorCooldownManager = new knub_1.CooldownManager();
    },
});
