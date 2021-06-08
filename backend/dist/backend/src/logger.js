"use strict";
// tslint-disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info(...args) {
        console.log("[INFO]", ...args);
    },
    warn(...args) {
        console.warn("[WARN]", ...args);
    },
    error(...args) {
        console.error("[ERROR]", ...args);
    },
    debug(...args) {
        console.log("[DEBUG]", ...args);
    },
    log(...args) {
        console.log(...args);
    },
};
