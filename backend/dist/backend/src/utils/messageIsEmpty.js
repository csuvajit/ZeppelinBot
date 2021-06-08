"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageIsEmpty = void 0;
const messageHasContent_1 = require("./messageHasContent");
function messageIsEmpty(content) {
    return !messageHasContent_1.messageHasContent(content);
}
exports.messageIsEmpty = messageIsEmpty;
