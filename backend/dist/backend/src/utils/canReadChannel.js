"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canReadChannel = void 0;
const readChannelPermissions_1 = require("./readChannelPermissions");
const getMissingChannelPermissions_1 = require("./getMissingChannelPermissions");
function canReadChannel(channel, member) {
    // Not missing permissions required to read the channel = can read channel
    return !getMissingChannelPermissions_1.getMissingChannelPermissions(member, channel, readChannelPermissions_1.readChannelPermissions);
}
exports.canReadChannel = canReadChannel;
