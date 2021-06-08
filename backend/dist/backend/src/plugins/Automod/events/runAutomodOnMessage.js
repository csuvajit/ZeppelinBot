"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutomodOnMessage = void 0;
const runAutomod_1 = require("../functions/runAutomod");
const addRecentActionsFromMessage_1 = require("../functions/addRecentActionsFromMessage");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const clearRecentActionsForMessage_1 = require("../functions/clearRecentActionsForMessage");
function runAutomodOnMessage(pluginData, message, isEdit) {
    const user = pluginData.client.users.get(message.user_id);
    const member = pluginData.guild.members.get(message.user_id);
    const context = {
        timestamp: moment_timezone_1.default.utc(message.posted_at).valueOf(),
        message,
        user,
        member,
    };
    pluginData.state.queue.add(async () => {
        if (isEdit) {
            clearRecentActionsForMessage_1.clearRecentActionsForMessage(pluginData, context);
        }
        addRecentActionsFromMessage_1.addRecentActionsFromMessage(pluginData, context);
        await runAutomod_1.runAutomod(pluginData, context);
    });
}
exports.runAutomodOnMessage = runAutomodOnMessage;
