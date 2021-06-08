"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowmodeListCmd = void 0;
const types_1 = require("../types");
const eris_1 = require("eris");
const helpers_1 = require("knub/dist/helpers");
const utils_1 = require("../../../utils");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
exports.SlowmodeListCmd = types_1.slowmodeCmd({
    trigger: ["slowmode list", "slowmode l", "slowmodes"],
    permission: "can_manage",
    async run({ message: msg, pluginData }) {
        const channels = pluginData.guild.channels;
        const slowmodes = [];
        for (const channel of channels.values()) {
            if (!(channel instanceof eris_1.TextChannel))
                continue;
            // Bot slowmode
            const botSlowmode = await pluginData.state.slowmodes.getChannelSlowmode(channel.id);
            if (botSlowmode) {
                slowmodes.push({ channel, seconds: botSlowmode.slowmode_seconds, native: false });
                continue;
            }
            // Native slowmode
            if (channel.rateLimitPerUser) {
                slowmodes.push({ channel, seconds: channel.rateLimitPerUser, native: true });
                continue;
            }
        }
        if (slowmodes.length) {
            const lines = slowmodes.map(slowmode => {
                const humanized = humanize_duration_1.default(slowmode.seconds * 1000);
                const type = slowmode.native ? "native slowmode" : "bot slowmode";
                return `<#${slowmode.channel.id}> **${humanized}** ${type}`;
            });
            helpers_1.createChunkedMessage(msg.channel, lines.join("\n"));
        }
        else {
            msg.channel.createMessage(utils_1.errorMessage("No active slowmodes!"));
        }
    },
});
