"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewAntiraidCmd = void 0;
const knub_1 = require("knub");
exports.ViewAntiraidCmd = knub_1.typedGuildCommand()({
    trigger: "antiraid",
    permission: "can_view_antiraid",
    async run({ pluginData, message }) {
        if (pluginData.state.cachedAntiraidLevel) {
            message.channel.createMessage(`Anti-raid is set to **${pluginData.state.cachedAntiraidLevel}**`);
        }
        else {
            message.channel.createMessage(`Anti-raid is **off**`);
        }
    },
});
