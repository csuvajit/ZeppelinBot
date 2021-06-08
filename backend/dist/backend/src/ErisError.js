"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErisError = void 0;
const util_1 = __importDefault(require("util"));
class ErisError extends Error {
    constructor(message, code, shardId) {
        super(message);
        this.code = code;
        this.shardId = shardId;
    }
    [util_1.default.inspect.custom]() {
        return `[ERIS] [ERROR CODE ${this.code || "?"}] [SHARD ${this.shardId}] ${this.message}`;
    }
}
exports.ErisError = ErisError;
