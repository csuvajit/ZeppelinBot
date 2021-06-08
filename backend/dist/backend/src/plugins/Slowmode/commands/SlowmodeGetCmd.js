"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowmodeGetCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const types_1 = require("../types");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
exports.SlowmodeGetCmd = types_1.slowmodeCmd({
    trigger: "slowmode",
    permission: "can_manage",
    source: "guild",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const channel = args.channel || msg.channel;
        let currentSlowmode = channel.rateLimitPerUser;
        let isNative = true;
        if (!currentSlowmode) {
            const botSlowmode = await pluginData.state.slowmodes.getChannelSlowmode(channel.id);
            if (botSlowmode) {
                currentSlowmode = botSlowmode.slowmode_seconds;
                isNative = false;
            }
        }
        if (currentSlowmode) {
            const humanized = humanize_duration_1.default(channel.rateLimitPerUser * 1000);
            const slowmodeType = isNative ? "native" : "bot-maintained";
            msg.channel.createMessage(`The current slowmode of <#${channel.id}> is **${humanized}** (${slowmodeType})`);
        }
        else {
            msg.channel.createMessage("Channel is not on slowmode");
        }
    },
});
