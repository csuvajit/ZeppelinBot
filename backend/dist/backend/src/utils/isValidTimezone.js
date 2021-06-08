"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTimezone = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const validTimezones = moment_timezone_1.default.tz.names();
function isValidTimezone(input) {
    return validTimezones.includes(input);
}
exports.isValidTimezone = isValidTimezone;
