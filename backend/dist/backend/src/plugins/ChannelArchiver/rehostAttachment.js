"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rehostAttachment = void 0;
const utils_1 = require("../../utils");
const fs_1 = __importDefault(require("fs"));
const fsp = fs_1.default.promises;
const MAX_ATTACHMENT_REHOST_SIZE = 1024 * 1024 * 8;
async function rehostAttachment(attachment, targetChannel) {
    if (attachment.size > MAX_ATTACHMENT_REHOST_SIZE) {
        return "Attachment too big to rehost";
    }
    let downloaded;
    try {
        downloaded = await utils_1.downloadFile(attachment.url, 3);
    }
    catch {
        return "Failed to download attachment after 3 tries";
    }
    try {
        const rehostMessage = await targetChannel.createMessage(`Rehost of attachment ${attachment.id}`, {
            name: attachment.filename,
            file: await fsp.readFile(downloaded.path),
        });
        return rehostMessage.attachments[0].url;
    }
    catch {
        return "Failed to rehost attachment";
    }
}
exports.rehostAttachment = rehostAttachment;
