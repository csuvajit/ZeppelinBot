"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageUpdate = void 0;
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
async function onMessageUpdate(pluginData, savedMessage, oldSavedMessage) {
    // To log a message update, either the message content or a rich embed has to change
    let logUpdate = false;
    const oldEmbedsToCompare = (oldSavedMessage.data.embeds || [])
        .map(e => lodash_clonedeep_1.default(e))
        .filter(e => e.type === "rich");
    const newEmbedsToCompare = (savedMessage.data.embeds || [])
        .map(e => lodash_clonedeep_1.default(e))
        .filter(e => e.type === "rich");
    for (const embed of [...oldEmbedsToCompare, ...newEmbedsToCompare]) {
        if (embed.thumbnail) {
            delete embed.thumbnail.width;
            delete embed.thumbnail.height;
        }
        if (embed.image) {
            delete embed.image.width;
            delete embed.image.height;
        }
    }
    if (oldSavedMessage.data.content !== savedMessage.data.content ||
        oldEmbedsToCompare.length !== newEmbedsToCompare.length ||
        JSON.stringify(oldEmbedsToCompare) !== JSON.stringify(newEmbedsToCompare)) {
        logUpdate = true;
    }
    if (!logUpdate) {
        return;
    }
    const user = await utils_1.resolveUser(pluginData.client, savedMessage.user_id);
    const channel = pluginData.guild.channels.get(savedMessage.channel_id);
    pluginData.state.guildLogs.log(LogType_1.LogType.MESSAGE_EDIT, {
        user: utils_1.stripObjectToScalars(user),
        channel: utils_1.stripObjectToScalars(channel),
        before: oldSavedMessage,
        after: savedMessage,
    });
}
exports.onMessageUpdate = onMessageUpdate;
