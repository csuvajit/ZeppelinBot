"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOT_SLOWMODE_DISABLE_PERMISSIONS = exports.BOT_SLOWMODE_CLEAR_PERMISSIONS = exports.BOT_SLOWMODE_PERMISSIONS = exports.NATIVE_SLOWMODE_PERMISSIONS = void 0;
const eris_1 = require("eris");
const p = eris_1.Constants.Permissions;
exports.NATIVE_SLOWMODE_PERMISSIONS = p.readMessages | p.manageChannels;
exports.BOT_SLOWMODE_PERMISSIONS = p.readMessages | p.manageRoles | p.manageMessages;
exports.BOT_SLOWMODE_CLEAR_PERMISSIONS = p.readMessages | p.manageRoles;
exports.BOT_SLOWMODE_DISABLE_PERMISSIONS = p.readMessages | p.manageRoles;
