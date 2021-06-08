"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageDelete = void 0;
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const types_1 = require("../types");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
async function onMessageDelete(pluginData, savedMessage) {
    const user = await utils_1.resolveUser(pluginData.client, savedMessage.user_id);
    const channel = pluginData.guild.channels.get(savedMessage.channel_id);
    if (user) {
        // Replace attachment URLs with media URLs
        if (savedMessage.data.attachments) {
            for (const attachment of savedMessage.data.attachments) {
                attachment.url = utils_1.useMediaUrls(attachment.url);
            }
        }
        // See comment on FORMAT_NO_TIMESTAMP in types.ts
        const config = pluginData.config.get();
        const timestampFormat = (config.format.timestamp !== types_1.FORMAT_NO_TIMESTAMP ? config.format.timestamp : null) ?? config.timestamp_format;
        pluginData.state.guildLogs.log(LogType_1.LogType.MESSAGE_DELETE, {
            user: utils_1.stripObjectToScalars(user),
            channel: utils_1.stripObjectToScalars(channel),
            messageDate: pluginData
                .getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin)
                .inGuildTz(moment_timezone_1.default.utc(savedMessage.data.timestamp, "x"))
                .format(timestampFormat),
            message: savedMessage,
        }, savedMessage.id);
    }
    else {
        pluginData.state.guildLogs.log(LogType_1.LogType.MESSAGE_DELETE_BARE, {
            messageId: savedMessage.id,
            channel: utils_1.stripObjectToScalars(channel),
        }, savedMessage.id);
    }
}
exports.onMessageDelete = onMessageDelete;
