"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleError = void 0;
const util_1 = __importDefault(require("util"));
class SimpleError extends Error {
    constructor(message) {
        super(message);
    }
    [util_1.default.inspect.custom](depth, options) {
        return `Error: ${this.message}`;
    }
}
exports.SimpleError = SimpleError;
