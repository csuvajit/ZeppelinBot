"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAntiraidCmd = void 0;
const knub_1 = require("knub");
const setAntiraidLevel_1 = require("../functions/setAntiraidLevel");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
exports.SetAntiraidCmd = knub_1.typedGuildCommand()({
    trigger: "antiraid",
    permission: "can_set_antiraid",
    signature: {
        level: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ pluginData, message, args }) {
        const config = pluginData.config.get();
        if (!config.antiraid_levels.includes(args.level)) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Unknown anti-raid level");
            return;
        }
        await setAntiraidLevel_1.setAntiraidLevel(pluginData, args.level, message.author);
        pluginUtils_1.sendSuccessMessage(pluginData, message.channel, `Anti-raid level set to **${args.level}**`);
    },
});
