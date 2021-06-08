"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessageToDeletionQueue = void 0;
const scheduleNextDeletion_1 = require("./scheduleNextDeletion");
const utils_1 = require("../../../utils");
function addMessageToDeletionQueue(pluginData, msg, delay) {
    const deleteAt = Date.now() + delay;
    pluginData.state.deletionQueue.push({ deleteAt, message: msg });
    pluginData.state.deletionQueue.sort(utils_1.sorter("deleteAt"));
    scheduleNextDeletion_1.scheduleNextDeletion(pluginData);
}
exports.addMessageToDeletionQueue = addMessageToDeletionQueue;
