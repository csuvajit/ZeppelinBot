"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarboardReactionRemoveAllEvt = exports.StarboardReactionRemoveEvt = void 0;
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
const types_1 = require("../types");
exports.StarboardReactionRemoveEvt = types_1.starboardEvt({
    event: "messageReactionRemove",
    async listener(meta) {
        const boardLock = await meta.pluginData.locks.acquire(lockNameHelpers_1.allStarboardsLock());
        await meta.pluginData.state.starboardReactions.deleteStarboardReaction(meta.args.message.id, meta.args.userID);
        boardLock.unlock();
    },
});
exports.StarboardReactionRemoveAllEvt = types_1.starboardEvt({
    event: "messageReactionRemoveAll",
    async listener(meta) {
        const boardLock = await meta.pluginData.locks.acquire(lockNameHelpers_1.allStarboardsLock());
        await meta.pluginData.state.starboardReactions.deleteAllStarboardReactionsForMessageId(meta.args.message.id);
        boardLock.unlock();
    },
});
