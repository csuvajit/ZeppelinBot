"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshMembersIfNeeded = void 0;
const utils_1 = require("../../utils");
const MEMBER_REFRESH_FREQUENCY = 1 * utils_1.HOURS; // How often to do a full member refresh when using commands that need it
const memberRefreshLog = new Map();
async function refreshMembersIfNeeded(guild) {
    const lastRefresh = memberRefreshLog.get(guild.id);
    if (lastRefresh && Date.now() < lastRefresh.time + MEMBER_REFRESH_FREQUENCY) {
        return lastRefresh.promise;
    }
    const loadPromise = guild.fetchAllMembers().then(utils_1.noop);
    memberRefreshLog.set(guild.id, {
        time: Date.now(),
        promise: loadPromise,
    });
    return loadPromise;
}
exports.refreshMembersIfNeeded = refreshMembersIfNeeded;
