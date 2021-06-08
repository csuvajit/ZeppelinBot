"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatReasonWithAttachments = void 0;
function formatReasonWithAttachments(reason, attachments) {
    const attachmentUrls = attachments.map(a => a.url);
    return ((reason || "") + " " + attachmentUrls.join(" ")).trim();
}
exports.formatReasonWithAttachments = formatReasonWithAttachments;
