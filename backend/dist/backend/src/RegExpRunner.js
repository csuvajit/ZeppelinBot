"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExpRunner = exports.allowTimeout = exports.RegExpTimeoutError = void 0;
const regexp_worker_1 = require("regexp-worker");
const knub_1 = require("knub");
const utils_1 = require("./utils");
const events_1 = require("events");
const isTimeoutError = (a) => {
    return a.message != null && a.elapsedTimeMs != null;
};
class RegExpTimeoutError extends Error {
    constructor(message, elapsedTimeMs) {
        super(message);
        this.elapsedTimeMs = elapsedTimeMs;
    }
}
exports.RegExpTimeoutError = RegExpTimeoutError;
function allowTimeout(err) {
    if (err instanceof RegExpTimeoutError) {
        return null;
    }
    throw err;
}
exports.allowTimeout = allowTimeout;
// Regex timeout starts at a higher value while the bot loads initially, and gets lowered afterwards
const INITIAL_REGEX_TIMEOUT = 5 * utils_1.SECONDS;
const INITIAL_REGEX_TIMEOUT_DURATION = 30 * utils_1.SECONDS;
const FINAL_REGEX_TIMEOUT = 5 * utils_1.SECONDS;
const regexTimeoutUpgradePromise = new Promise(resolve => setTimeout(resolve, INITIAL_REGEX_TIMEOUT_DURATION));
let newWorkerTimeout = INITIAL_REGEX_TIMEOUT;
regexTimeoutUpgradePromise.then(() => (newWorkerTimeout = FINAL_REGEX_TIMEOUT));
const REGEX_FAIL_TO_COOLDOWN_COUNT = 5; // If a regex times out this many times...
const REGEX_FAIL_DECAY_TIME = 2 * utils_1.MINUTES; // ...in this interval...
const REGEX_FAIL_COOLDOWN = 2 * utils_1.MINUTES + 30 * utils_1.SECONDS; // ...it goes on cooldown for this long
/**
 * Leverages RegExpWorker to run regular expressions in worker threads with a timeout.
 * Repeatedly failing regexes are put on a cooldown where requests to execute them are ignored.
 */
class RegExpRunner extends events_1.EventEmitter {
    constructor() {
        super();
        this.cooldown = new knub_1.CooldownManager();
        this.failedTimes = new Map();
        this._failedTimesInterval = setInterval(() => {
            for (const [pattern, times] of this.failedTimes.entries()) {
                this.failedTimes.set(pattern, times - 1);
            }
        }, REGEX_FAIL_DECAY_TIME);
    }
    get worker() {
        if (!this._worker) {
            this._worker = new regexp_worker_1.RegExpWorker(newWorkerTimeout);
            if (newWorkerTimeout !== FINAL_REGEX_TIMEOUT) {
                regexTimeoutUpgradePromise.then(() => {
                    if (!this._worker)
                        return;
                    this._worker.timeout = FINAL_REGEX_TIMEOUT;
                });
            }
        }
        return this._worker;
    }
    async exec(regex, str) {
        if (this.cooldown.isOnCooldown(regex.source)) {
            return null;
        }
        try {
            const result = await this.worker.execRegExp(regex, str);
            return result.matches.length || regex.global ? result.matches : null;
        }
        catch (e) {
            if (isTimeoutError(e)) {
                if (this.failedTimes.has(regex.source)) {
                    // Regex has failed before, increment fail counter
                    this.failedTimes.set(regex.source, this.failedTimes.get(regex.source) + 1);
                }
                else {
                    // This is the first time this regex failed, init fail counter
                    this.failedTimes.set(regex.source, 1);
                }
                if (this.failedTimes.has(regex.source) && this.failedTimes.get(regex.source) >= REGEX_FAIL_TO_COOLDOWN_COUNT) {
                    // Regex has failed too many times, set it on cooldown
                    this.cooldown.setCooldown(regex.source, REGEX_FAIL_COOLDOWN);
                    this.failedTimes.delete(regex.source);
                    this.emit("repeatedTimeout", regex.source, this.worker.timeout, REGEX_FAIL_TO_COOLDOWN_COUNT);
                }
                this.emit("timeout", regex.source, this.worker.timeout);
                throw new RegExpTimeoutError(e.message, e.elapsedTimeMs);
            }
            throw e;
        }
    }
    async dispose() {
        await this.worker.dispose();
        this._worker = null;
        clearInterval(this._failedTimesInterval);
    }
}
exports.RegExpRunner = RegExpRunner;
