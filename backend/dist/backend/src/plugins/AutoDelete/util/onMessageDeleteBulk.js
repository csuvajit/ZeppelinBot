"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageDeleteBulk = void 0;
const onMessageDelete_1 = require("./onMessageDelete");
function onMessageDeleteBulk(pluginData, messages) {
    for (const msg of messages) {
        onMessageDelete_1.onMessageDelete(pluginData, msg);
    }
}
exports.onMessageDeleteBulk = onMessageDeleteBulk;
