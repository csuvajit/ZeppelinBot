"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingPermissionError = void 0;
const getPermissionNames_1 = require("./getPermissionNames");
function missingPermissionError(missingPermissions) {
    const permissionNames = getPermissionNames_1.getPermissionNames(missingPermissions);
    return `Missing permissions: **${permissionNames.join("**, **")}**`;
}
exports.missingPermissionError = missingPermissionError;
