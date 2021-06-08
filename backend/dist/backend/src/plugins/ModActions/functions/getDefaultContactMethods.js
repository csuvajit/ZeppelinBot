"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultContactMethods = void 0;
const eris_1 = require("eris");
function getDefaultContactMethods(pluginData, type) {
    const methods = [];
    const config = pluginData.config.get();
    if (config[`dm_on_${type}`]) {
        methods.push({ type: "dm" });
    }
    if (config[`message_on_${type}`] && config.message_channel) {
        const channel = pluginData.guild.channels.get(config.message_channel);
        if (channel instanceof eris_1.TextChannel) {
            methods.push({
                type: "channel",
                channel,
            });
        }
    }
    return methods;
}
exports.getDefaultContactMethods = getDefaultContactMethods;
