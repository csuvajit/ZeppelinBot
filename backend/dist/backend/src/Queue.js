"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const utils_1 = require("./utils");
const DEFAULT_TIMEOUT = 10 * utils_1.SECONDS;
class Queue {
    constructor(timeout = DEFAULT_TIMEOUT) {
        this.running = false;
        this.queue = [];
        this._timeout = timeout;
    }
    get timeout() {
        return this._timeout;
    }
    /**
     * The number of operations that are currently queued up or running.
     * I.e. backlog (queue) + current running process, if any.
     *
     * If this is 0, queueing a function will run it as soon as possible.
     */
    get length() {
        return this.queue.length + (this.running ? 1 : 0);
    }
    add(fn) {
        const promise = new Promise(resolve => {
            this.queue.push(async () => {
                await fn();
                resolve();
            });
            if (!this.running)
                this.next();
        });
        return promise;
    }
    next() {
        this.running = true;
        if (this.queue.length === 0) {
            this.running = false;
            return;
        }
        const fn = this.queue.shift();
        new Promise(resolve => {
            // Either fn() completes or the timeout is reached
            void fn().then(resolve);
            setTimeout(resolve, this._timeout);
        }).then(() => this.next());
    }
    clear() {
        this.queue.splice(0, this.queue.length);
    }
}
exports.Queue = Queue;
