"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleNextDeletion = void 0;
const deleteNextItem_1 = require("./deleteNextItem");
function scheduleNextDeletion(pluginData) {
    if (pluginData.state.deletionQueue.length === 0) {
        clearTimeout(pluginData.state.nextDeletionTimeout);
        return;
    }
    const firstDeleteAt = pluginData.state.deletionQueue[0].deleteAt;
    clearTimeout(pluginData.state.nextDeletionTimeout);
    pluginData.state.nextDeletionTimeout = setTimeout(() => deleteNextItem_1.deleteNextItem(pluginData), firstDeleteAt - Date.now());
}
exports.scheduleNextDeletion = scheduleNextDeletion;
