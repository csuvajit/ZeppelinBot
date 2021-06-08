"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseScheduleTime = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const utils_1 = require("../../../utils");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
// TODO: Extract out of the Post plugin, use everywhere with a date input
async function parseScheduleTime(pluginData, memberId, str) {
    const tz = await pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin).getMemberTz(memberId);
    const dt1 = moment_timezone_1.default.tz(str, "YYYY-MM-DD HH:mm:ss", tz);
    if (dt1 && dt1.isValid())
        return dt1;
    const dt2 = moment_timezone_1.default.tz(str, "YYYY-MM-DD HH:mm", tz);
    if (dt2 && dt2.isValid())
        return dt2;
    const date = moment_timezone_1.default.tz(str, "YYYY-MM-DD", tz);
    if (date && date.isValid())
        return date;
    const t1 = moment_timezone_1.default.tz(str, "HH:mm:ss", tz);
    if (t1 && t1.isValid()) {
        if (t1.isBefore(moment_timezone_1.default.utc()))
            t1.add(1, "day");
        return t1;
    }
    const t2 = moment_timezone_1.default.tz(str, "HH:mm", tz);
    if (t2 && t2.isValid()) {
        if (t2.isBefore(moment_timezone_1.default.utc()))
            t2.add(1, "day");
        return t2;
    }
    const delayStringMS = utils_1.convertDelayStringToMS(str, "m");
    if (delayStringMS) {
        return moment_timezone_1.default.tz(tz).add(delayStringMS, "ms");
    }
    return null;
}
exports.parseScheduleTime = parseScheduleTime;
