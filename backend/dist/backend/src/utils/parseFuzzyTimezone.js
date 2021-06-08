"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFuzzyTimezone = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const normalizeTzName = str => str.replace(/[^a-zA-Z0-9+\-]/g, "").toLowerCase();
const validTimezones = moment_timezone_1.default.tz.names();
const normalizedTimezoneMap = validTimezones.reduce((map, tz) => {
    map.set(normalizeTzName(tz), tz);
    return map;
}, new Map());
const normalizedTimezones = Array.from(normalizedTimezoneMap.keys());
function parseFuzzyTimezone(input) {
    const normalizedInput = normalizeTzName(input);
    if (normalizedTimezoneMap.has(normalizedInput)) {
        return normalizedTimezoneMap.get(normalizedInput);
    }
    const searchRegex = new RegExp(`.*${escape_string_regexp_1.default(normalizedInput)}.*`);
    for (const tz of normalizedTimezones) {
        if (searchRegex.test(tz)) {
            const result = normalizedTimezoneMap.get(tz);
            // Ignore Etc/GMT timezones unless explicitly specified, as they have confusing functionality
            // with the inverted +/- sign
            if (result.startsWith("Etc/GMT"))
                continue;
            return result;
        }
    }
    return null;
}
exports.parseFuzzyTimezone = parseFuzzyTimezone;
