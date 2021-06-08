"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const crypt_1 = require("./crypt");
ava_1.default("encrypt() followed by decrypt()", t => {
    const original = "banana 123 👀 💕"; // Includes emojis to verify utf8 stuff works
    const encrypted = crypt_1.encrypt(original);
    const decrypted = crypt_1.decrypt(encrypted);
    t.is(decrypted, original);
});
