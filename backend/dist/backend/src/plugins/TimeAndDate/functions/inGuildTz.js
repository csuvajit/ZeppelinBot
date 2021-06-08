"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inGuildTz = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getGuildTz_1 = require("./getGuildTz");
function inGuildTz(pluginData, input) {
    let momentObj;
    if (typeof input === "number") {
        momentObj = moment_timezone_1.default.utc(input, "x");
    }
    else if (moment_timezone_1.default.isMoment(input)) {
        momentObj = input.clone();
    }
    else {
        momentObj = moment_timezone_1.default.utc();
    }
    return momentObj.tz(getGuildTz_1.getGuildTz(pluginData));
}
exports.inGuildTz = inGuildTz;
