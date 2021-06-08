"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildEvents = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const QueuedEventEmitter_1 = require("../QueuedEventEmitter");
class GuildEvents extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.queuedEventEmitter = new QueuedEventEmitter_1.QueuedEventEmitter();
    }
    on(pluginName, eventName, fn) {
        this.queuedEventEmitter.on(eventName, fn);
        if (!this.pluginListeners.has(pluginName)) {
            this.pluginListeners.set(pluginName, new Map());
        }
        const pluginListeners = this.pluginListeners.get(pluginName);
        if (!pluginListeners.has(eventName)) {
            pluginListeners.set(eventName, []);
        }
        const pluginEventListeners = pluginListeners.get(eventName);
        pluginEventListeners.push(fn);
    }
    offPlugin(pluginName) {
        const pluginListeners = this.pluginListeners.get(pluginName) || new Map();
        for (const [eventName, listeners] of Array.from(pluginListeners.entries())) {
            for (const listener of listeners) {
                this.queuedEventEmitter.off(eventName, listener);
            }
        }
        this.pluginListeners.delete(pluginName);
    }
    emit(eventName, args = []) {
        return this.queuedEventEmitter.emit(eventName, args);
    }
}
exports.GuildEvents = GuildEvents;
