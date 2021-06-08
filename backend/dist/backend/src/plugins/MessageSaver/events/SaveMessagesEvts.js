"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDeleteBulkEvt = exports.MessageDeleteEvt = exports.MessageUpdateEvt = exports.MessageCreateEvt = void 0;
const types_1 = require("../types");
exports.MessageCreateEvt = types_1.messageSaverEvt({
    event: "messageCreate",
    allowBots: true,
    allowSelf: true,
    async listener(meta) {
        // Only save regular chat messages
        if (meta.args.message.type !== 0) {
            return;
        }
        await meta.pluginData.state.savedMessages.createFromMsg(meta.args.message);
    },
});
exports.MessageUpdateEvt = types_1.messageSaverEvt({
    event: "messageUpdate",
    allowBots: true,
    allowSelf: true,
    async listener(meta) {
        if (meta.args.message.type !== 0) {
            return;
        }
        await meta.pluginData.state.savedMessages.saveEditFromMsg(meta.args.message);
    },
});
exports.MessageDeleteEvt = types_1.messageSaverEvt({
    event: "messageDelete",
    allowBots: true,
    allowSelf: true,
    async listener(meta) {
        const msg = meta.args.message;
        if (msg.type != null && msg.type !== 0) {
            return;
        }
        await meta.pluginData.state.savedMessages.markAsDeleted(msg.id);
    },
});
exports.MessageDeleteBulkEvt = types_1.messageSaverEvt({
    event: "messageDeleteBulk",
    allowBots: true,
    allowSelf: true,
    async listener(meta) {
        const ids = meta.args.messages.map(m => m.id);
        await meta.pluginData.state.savedMessages.markBulkAsDeleted(ids);
    },
});
