"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const normalizeText_1 = require("./normalizeText");
ava_1.default("Replaces special characters", t => {
    const from = "𝗧:regional_indicator_e:ᔕ7 𝗧:regional_indicator_e:ᔕ7 𝗧:regional_indicator_e:ᔕ7";
    const to = "test test test";
    t.deepEqual(normalizeText_1.normalizeText(from), to);
});
ava_1.default("Does not change lowercase ASCII text", t => {
    const text = "lorem ipsum dolor sit amet consectetur adipiscing elit";
    t.deepEqual(normalizeText_1.normalizeText(text), text);
});
ava_1.default("Replaces whitespace", t => {
    const from = "foo    bar";
    const to = "foo bar";
    t.deepEqual(normalizeText_1.normalizeText(from), to);
});
ava_1.default("Result is always lowercase", t => {
    const from = "TEST";
    const to = "test";
    t.deepEqual(normalizeText_1.normalizeText(from), to);
});
