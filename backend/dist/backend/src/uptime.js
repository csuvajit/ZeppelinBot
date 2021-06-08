"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUptime = exports.startUptimeCounter = void 0;
let start = 0;
function startUptimeCounter() {
    start = Date.now();
}
exports.startUptimeCounter = startUptimeCounter;
function getCurrentUptime() {
    return Date.now() - start;
}
exports.getCurrentUptime = getCurrentUptime;
