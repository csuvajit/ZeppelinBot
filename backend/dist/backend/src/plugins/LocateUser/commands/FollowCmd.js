"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
exports.FollowCmd = types_1.locateUserCmd({
    trigger: ["follow", "f"],
    description: "Sets up an alert that notifies you any time `<member>` switches or joins voice channels",
    usage: "!f 108552944961454080",
    permission: "can_alert",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember(),
        reminder: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
        duration: commandTypes_1.commandTypeHelpers.delay({ option: true, shortcut: "d" }),
        active: commandTypes_1.commandTypeHelpers.bool({ option: true, shortcut: "a", isSwitch: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const time = args.duration || 10 * utils_1.MINUTES;
        const alertTime = moment_timezone_1.default.utc().add(time, "millisecond");
        const body = args.reminder || "None";
        const active = args.active || false;
        if (time < 30 * utils_1.SECONDS) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Sorry, but the minimum duration for an alert is 30 seconds!");
            return;
        }
        await pluginData.state.alerts.add(msg.author.id, args.member.id, msg.channel.id, alertTime.format("YYYY-MM-DD HH:mm:ss"), body, active);
        if (!pluginData.state.usersWithAlerts.includes(args.member.id)) {
            pluginData.state.usersWithAlerts.push(args.member.id);
        }
        if (active) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Every time ${args.member.mention} joins or switches VC in the next ${humanize_duration_1.default(time)} i will notify and move you.\nPlease make sure to be in a voice channel, otherwise i cannot move you!`);
        }
        else {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Every time ${args.member.mention} joins or switches VC in the next ${humanize_duration_1.default(time)} i will notify you`);
        }
    },
});
