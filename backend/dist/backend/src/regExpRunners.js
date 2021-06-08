"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discardRegExpRunner = exports.getRegExpRunner = void 0;
const RegExpRunner_1 = require("./RegExpRunner");
const runners = new Map();
function getRegExpRunner(key) {
    if (!runners.has(key)) {
        const runner = new RegExpRunner_1.RegExpRunner();
        runners.set(key, {
            users: 0,
            runner,
        });
    }
    const info = runners.get(key);
    info.users++;
    return info.runner;
}
exports.getRegExpRunner = getRegExpRunner;
function discardRegExpRunner(key) {
    if (!runners.has(key)) {
        throw new Error(`No runners with key ${key}, cannot discard`);
    }
    const info = runners.get(key);
    info.users--;
    if (info.users <= 0) {
        info.runner.dispose();
        runners.delete(key);
    }
}
exports.discardRegExpRunner = discardRegExpRunner;
