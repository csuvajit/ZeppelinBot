"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageDelete = void 0;
const scheduleNextDeletion_1 = require("./scheduleNextDeletion");
function onMessageDelete(pluginData, msg) {
    const indexToDelete = pluginData.state.deletionQueue.findIndex(item => item.message.id === msg.id);
    if (indexToDelete > -1) {
        pluginData.state.deletionQueue.splice(indexToDelete, 1);
        scheduleNextDeletion_1.scheduleNextDeletion(pluginData);
    }
}
exports.onMessageDelete = onMessageDelete;
