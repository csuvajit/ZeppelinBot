"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.muteLock = exports.messageLock = exports.memberRolesLock = exports.counterIdLock = exports.banLock = exports.allStarboardsLock = void 0;
function allStarboardsLock() {
    return `starboards`;
}
exports.allStarboardsLock = allStarboardsLock;
function banLock(user) {
    return `ban-${user.id}`;
}
exports.banLock = banLock;
function counterIdLock(counterId) {
    return `counter-${counterId}`;
}
exports.counterIdLock = counterIdLock;
function memberRolesLock(member) {
    return `member-roles-${member.id}`;
}
exports.memberRolesLock = memberRolesLock;
function messageLock(message) {
    return `message-${message.id}`;
}
exports.messageLock = messageLock;
function muteLock(user) {
    return `mute-${user.id}`;
}
exports.muteLock = muteLock;
