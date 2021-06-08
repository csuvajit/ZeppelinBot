"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nReadChannelPermissions = exports.readChannelPermissions = void 0;
const eris_1 = require("eris");
/**
 * Bitmask of permissions required to read messages in a channel
 */
exports.readChannelPermissions = eris_1.Constants.Permissions.readMessages | eris_1.Constants.Permissions.readMessageHistory;
/**
 * Bitmask of permissions required to read messages in a channel (bigint)
 */
exports.nReadChannelPermissions = BigInt(exports.readChannelPermissions);
