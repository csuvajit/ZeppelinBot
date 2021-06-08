"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = void 0;
const utils_1 = require("../../../utils");
const fs_1 = __importDefault(require("fs"));
const formatContent_1 = require("./formatContent");
const fsp = fs_1.default.promises;
async function postMessage(pluginData, channel, content, attachments = [], enableMentions = false) {
    if (typeof content === "string") {
        content = { content };
    }
    if (content && content.content) {
        content.content = formatContent_1.formatContent(content.content);
    }
    let downloadedAttachment;
    let file;
    if (attachments.length) {
        downloadedAttachment = await utils_1.downloadFile(attachments[0].url);
        file = {
            name: attachments[0].filename,
            file: await fsp.readFile(downloadedAttachment.path),
        };
    }
    if (enableMentions) {
        content.allowedMentions = {
            everyone: true,
            users: true,
            roles: true,
        };
    }
    const createdMsg = await channel.createMessage(content, file);
    pluginData.state.savedMessages.setPermanent(createdMsg.id);
    if (downloadedAttachment) {
        downloadedAttachment.deleteFn();
    }
    return createdMsg;
}
exports.postMessage = postMessage;
