"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaff = void 0;
/**
 * Zeppelin staff have full access to the dashboard
 */
function isStaff(userId) {
    return (process.env.STAFF ?? "").split(",").includes(userId);
}
exports.isStaff = isStaff;
