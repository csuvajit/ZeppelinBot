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
exports.messageAction = exports.MessageAction = void 0;
const t = __importStar(require("io-ts"));
const templateFormatter_1 = require("../../../templateFormatter");
const ActionError_1 = require("../ActionError");
const eris_1 = require("eris");
exports.MessageAction = t.type({
    type: t.literal("message"),
    channel: t.string,
    content: t.string,
});
async function messageAction(pluginData, action, values) {
    const targetChannelId = await templateFormatter_1.renderTemplate(action.channel, values, false);
    const targetChannel = pluginData.guild.channels.get(targetChannelId);
    if (!targetChannel)
        throw new ActionError_1.ActionError("Unknown target channel");
    if (!(targetChannel instanceof eris_1.TextChannel))
        throw new ActionError_1.ActionError("Target channel is not a text channel");
    await targetChannel.createMessage({ content: action.content });
}
exports.messageAction = messageAction;
