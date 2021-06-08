"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiraidClearCmd = void 0;
const knub_1 = require("knub");
const setAntiraidLevel_1 = require("../functions/setAntiraidLevel");
const pluginUtils_1 = require("../../../pluginUtils");
exports.AntiraidClearCmd = knub_1.typedGuildCommand()({
    trigger: ["antiraid clear", "antiraid reset", "antiraid none", "antiraid off"],
    permission: "can_set_antiraid",
    async run({ pluginData, message }) {
        await setAntiraidLevel_1.setAntiraidLevel(pluginData, null, message.author);
        pluginUtils_1.sendSuccessMessage(pluginData, message.channel, "Anti-raid turned **off**");
    },
});
