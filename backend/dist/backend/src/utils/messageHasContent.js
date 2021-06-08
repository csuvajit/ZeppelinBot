"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHasContent = void 0;
function embedHasContent(embed) {
    for (const [key, value] of Object.entries(embed)) {
        if (typeof value === "string" && value.trim() !== "") {
            return true;
        }
        if (typeof value === "object" && value != null && embedHasContent(value)) {
            return true;
        }
        if (value != null) {
            return true;
        }
    }
    return false;
}
function messageHasContent(content) {
    if (typeof content === "string") {
        return content.trim() !== "";
    }
    if (content.content != null && content.content.trim() !== "") {
        return true;
    }
    if (content.embed && embedHasContent(content.embed)) {
        return true;
    }
    return false;
}
exports.messageHasContent = messageHasContent;
