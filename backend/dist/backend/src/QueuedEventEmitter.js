"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuedEventEmitter = void 0;
const Queue_1 = require("./Queue");
class QueuedEventEmitter {
    constructor() {
        this.listeners = new Map();
        this.queue = new Queue_1.Queue();
    }
    on(eventName, listener) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(listener);
        return listener;
    }
    off(eventName, listener) {
        if (!this.listeners.has(eventName)) {
            return;
        }
        const listeners = this.listeners.get(eventName);
        listeners.splice(listeners.indexOf(listener), 1);
    }
    once(eventName, listener) {
        const handler = this.on(eventName, (...args) => {
            const result = listener(...args);
            this.off(eventName, handler);
            return result;
        });
        return handler;
    }
    emit(eventName, args = []) {
        const listeners = [...(this.listeners.get(eventName) || []), ...(this.listeners.get("*") || [])];
        let promise = Promise.resolve();
        listeners.forEach(listener => {
            promise = this.queue.add(listener.bind(null, ...args));
        });
        return promise;
    }
}
exports.QueuedEventEmitter = QueuedEventEmitter;
