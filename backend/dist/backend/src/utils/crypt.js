"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
require("../loadEnv");
const crypto_1 = __importDefault(require("crypto"));
if (!process.env.KEY) {
    // tslint:disable-next-line:no-console
    console.error("Environment value KEY required for encryption");
    process.exit(1);
}
const KEY = process.env.KEY;
const ALGORITHM = "aes-256-gcm";
function encrypt(str) {
    // Based on https://gist.github.com/rjz/15baffeab434b8125ca4d783f4116d81
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(str, "utf8", "base64");
    encrypted += cipher.final("base64");
    return `${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${encrypted}`;
}
exports.encrypt = encrypt;
function decrypt(encrypted) {
    // Based on https://gist.github.com/rjz/15baffeab434b8125ca4d783f4116d81
    const [iv, authTag, encryptedStr] = encrypted.split(".");
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "base64"));
    decipher.setAuthTag(Buffer.from(authTag, "base64"));
    let decrypted = decipher.update(encryptedStr, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
exports.decrypt = decrypt;
