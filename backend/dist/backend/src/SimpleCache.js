"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCache = void 0;
const CLEAN_INTERVAL = 1000;
class SimpleCache {
    constructor(retentionTime, maxItems) {
        this.retentionTime = retentionTime;
        if (maxItems) {
            this.maxItems = maxItems;
        }
        this.store = new Map();
    }
    unload() {
        this.unloaded = true;
        clearTimeout(this.cleanTimeout);
    }
    cleanLoop() {
        const now = Date.now();
        for (const [key, info] of this.store.entries()) {
            if (now >= info.remove_at) {
                this.store.delete(key);
            }
        }
        if (!this.unloaded) {
            this.cleanTimeout = setTimeout(() => this.cleanLoop(), CLEAN_INTERVAL);
        }
    }
    set(key, value) {
        this.store.set(key, {
            remove_at: Date.now() + this.retentionTime,
            value,
        });
        if (this.maxItems && this.store.size > this.maxItems) {
            const keyToDelete = this.store.keys().next().value;
            this.store.delete(keyToDelete);
        }
    }
    get(key) {
        const info = this.store.get(key);
        if (!info)
            return null;
        return info.value;
    }
    has(key) {
        return this.store.has(key);
    }
    delete(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
}
exports.SimpleCache = SimpleCache;
