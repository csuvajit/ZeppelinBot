"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetSlowmodeAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const eris_1 = require("eris");
exports.SetSlowmodeAction = helpers_1.automodAction({
    configType: t.type({
        channels: t.array(t.string),
        duration: utils_1.tNullable(utils_1.tDelayString),
    }),
    defaultConfig: {
        duration: "10s",
    },
    async apply({ pluginData, actionConfig }) {
        const slowmodeMs = Math.max(actionConfig.duration ? utils_1.convertDelayStringToMS(actionConfig.duration) : 0, 0);
        for (const channelId of actionConfig.channels) {
            const channel = pluginData.guild.channels.get(channelId);
            // Only text channels and text channels within categories support slowmodes
            if (!channel ||
                !(channel.type === eris_1.Constants.ChannelTypes.GUILD_TEXT || channel.type === eris_1.Constants.ChannelTypes.GUILD_CATEGORY)) {
                continue;
            }
            let channelsToSlowmode = [];
            if (channel.type === eris_1.Constants.ChannelTypes.GUILD_CATEGORY) {
                // Find all text channels within the category
                channelsToSlowmode = pluginData.guild.channels.filter(ch => ch.parentID === channel.id && ch.type === eris_1.Constants.ChannelTypes.GUILD_TEXT);
            }
            else {
                channelsToSlowmode.push(channel);
            }
            const slowmodeSeconds = Math.ceil(slowmodeMs / 1000);
            try {
                for (const chan of channelsToSlowmode) {
                    await chan.edit({
                        rateLimitPerUser: slowmodeSeconds,
                    });
                }
            }
            catch (e) {
                // Check for invalid form body -> indicates duration was too large
                const errorMessage = utils_1.isDiscordRESTError(e) && e.code === 50035
                    ? `Duration is greater than maximum native slowmode duration`
                    : e.message;
                pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Unable to set slowmode for channel ${channel.id} to ${slowmodeSeconds} seconds: ${errorMessage}`,
                });
            }
        }
    },
});
