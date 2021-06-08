"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchingMessageRecentActions = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getMatchingRecentActions_1 = require("./getMatchingRecentActions");
function getMatchingMessageRecentActions(pluginData, message, type, identifier, count, within) {
    const since = moment_timezone_1.default.utc(message.posted_at).valueOf() - within;
    const to = moment_timezone_1.default.utc(message.posted_at).valueOf();
    const recentActions = getMatchingRecentActions_1.getMatchingRecentActions(pluginData, type, identifier, since, to);
    const totalCount = recentActions.reduce((total, action) => total + action.count, 0);
    if (totalCount >= count) {
        return {
            recentActions,
        };
    }
}
exports.getMatchingMessageRecentActions = getMatchingMessageRecentActions;
