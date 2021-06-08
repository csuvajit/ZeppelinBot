"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const ava_1 = __importDefault(require("ava"));
ava_1.default("getUrlsInString(): detects full links", t => {
    const urls = utils_1.getUrlsInString("foo https://google.com/ bar");
    t.is(urls.length, 1);
    t.is(urls[0].hostname, "google.com");
});
ava_1.default("getUrlsInString(): detects partial links", t => {
    const urls = utils_1.getUrlsInString("foo google.com bar");
    t.is(urls.length, 1);
    t.is(urls[0].hostname, "google.com");
});
ava_1.default("getUrlsInString(): detects subdomains", t => {
    const urls = utils_1.getUrlsInString("foo photos.google.com bar");
    t.is(urls.length, 1);
    t.is(urls[0].hostname, "photos.google.com");
});
ava_1.default("delay strings: basic support", t => {
    const delayString = "2w4d7h32m17s";
    const expected = 1582337000;
    t.is(utils_1.convertDelayStringToMS(delayString), expected);
});
ava_1.default("delay strings: default unit (minutes)", t => {
    t.is(utils_1.convertDelayStringToMS("10"), 10 * 60 * 1000);
});
ava_1.default("delay strings: custom default unit", t => {
    t.is(utils_1.convertDelayStringToMS("10", "s"), 10 * 1000);
});
ava_1.default("delay strings: reverse conversion", t => {
    const ms = 1582337020;
    const expected = "2w4d7h32m17s20x";
    t.is(utils_1.convertMSToDelayString(ms), expected);
});
ava_1.default("delay strings: reverse conversion (conservative)", t => {
    const ms = 1209600000;
    const expected = "2w";
    t.is(utils_1.convertMSToDelayString(ms), expected);
});
ava_1.default("tAllowedMentions matches Eris's AllowedMentions", t => {
    const typeTest = true;
    t.pass();
});
