"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageSpamIdentifier = void 0;
function getMessageSpamIdentifier(message, perChannel) {
    return perChannel ? `${message.channel_id}-${message.user_id}` : message.user_id;
}
exports.getMessageSpamIdentifier = getMessageSpamIdentifier;
