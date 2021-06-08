"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreate = void 0;
const applyFiltersToMsg_1 = require("./applyFiltersToMsg");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
async function onMessageCreate(pluginData, savedMessage) {
    if (savedMessage.is_bot)
        return;
    const lock = await pluginData.locks.acquire(lockNameHelpers_1.messageLock(savedMessage));
    const wasDeleted = await applyFiltersToMsg_1.applyFiltersToMsg(pluginData, savedMessage);
    if (wasDeleted) {
        lock.interrupt();
    }
    else {
        lock.unlock();
    }
}
exports.onMessageCreate = onMessageCreate;
