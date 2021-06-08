"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetActiveReload = exports.setActiveReload = exports.getActiveReload = void 0;
let activeReload = null;
function getActiveReload() {
    return activeReload;
}
exports.getActiveReload = getActiveReload;
function setActiveReload(guildId, channelId) {
    activeReload = [guildId, channelId];
}
exports.setActiveReload = setActiveReload;
function resetActiveReload() {
    activeReload = null;
}
exports.resetActiveReload = resetActiveReload;
