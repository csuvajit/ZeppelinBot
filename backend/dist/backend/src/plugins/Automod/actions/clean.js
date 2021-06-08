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
exports.CleanAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
exports.CleanAction = helpers_1.automodAction({
    configType: t.boolean,
    defaultConfig: false,
    async apply({ pluginData, contexts, ruleName }) {
        const messageIdsToDeleteByChannelId = new Map();
        for (const context of contexts) {
            if (context.message) {
                if (!messageIdsToDeleteByChannelId.has(context.message.channel_id)) {
                    messageIdsToDeleteByChannelId.set(context.message.channel_id, []);
                }
                if (messageIdsToDeleteByChannelId.get(context.message.channel_id).includes(context.message.id)) {
                    console.warn(`Message ID to delete was already present: ${pluginData.guild.name}, rule ${ruleName}`);
                    continue;
                }
                messageIdsToDeleteByChannelId.get(context.message.channel_id).push(context.message.id);
            }
        }
        for (const [channelId, messageIds] of messageIdsToDeleteByChannelId.entries()) {
            for (const id of messageIds) {
                pluginData.state.logs.ignoreLog(LogType_1.LogType.MESSAGE_DELETE, id);
            }
            await pluginData.client.deleteMessages(channelId, messageIds).catch(utils_1.noop);
        }
    },
});
