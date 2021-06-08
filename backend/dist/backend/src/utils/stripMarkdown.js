"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripMarkdown = void 0;
function stripMarkdown(str) {
    return str.replace(/[*_|~`]/g, "");
}
exports.stripMarkdown = stripMarkdown;
