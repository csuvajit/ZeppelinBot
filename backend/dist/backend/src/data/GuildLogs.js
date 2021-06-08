"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildLogs = void 0;
const events = __importStar(require("events"));
// Use the same instance for the same guild, even if a new instance is created
const guildInstances = new Map();
class GuildLogs extends events.EventEmitter {
    constructor(guildId) {
        if (guildInstances.has(guildId)) {
            // Return existing instance for this guild if one exists
            return guildInstances.get(guildId);
        }
        super();
        this.guildId = guildId;
        this.ignoredLogs = [];
        // Store the instance for this guild so it can be returned later if a new instance for this guild is requested
        guildInstances.set(guildId, this);
    }
    log(type, data, ignoreId) {
        if (ignoreId && this.isLogIgnored(type, ignoreId)) {
            this.clearIgnoredLog(type, ignoreId);
            return;
        }
        this.emit("log", { type, data });
    }
    ignoreLog(type, ignoreId, timeout) {
        this.ignoredLogs.push({ type, ignoreId });
        // Clear after expiry (15sec by default)
        setTimeout(() => {
            this.clearIgnoredLog(type, ignoreId);
        }, timeout || 1000 * 15);
    }
    isLogIgnored(type, ignoreId) {
        return this.ignoredLogs.some(info => type === info.type && ignoreId === info.ignoreId);
    }
    clearIgnoredLog(type, ignoreId) {
        this.ignoredLogs.splice(this.ignoredLogs.findIndex(info => type === info.type && ignoreId === info.ignoreId), 1);
    }
}
exports.GuildLogs = GuildLogs;
