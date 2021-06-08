"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowmodeSetCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const types_1 = require("../types");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const disableBotSlowmodeForChannel_1 = require("../util/disableBotSlowmodeForChannel");
const actualDisableSlowmodeCmd_1 = require("../util/actualDisableSlowmodeCmd");
const getMissingPermissions_1 = require("../../../utils/getMissingPermissions");
const missingPermissionError_1 = require("../../../utils/missingPermissionError");
const requiredPermissions_1 = require("../requiredPermissions");
const MAX_NATIVE_SLOWMODE = 6 * utils_1.HOURS; // 6 hours
const MAX_BOT_SLOWMODE = utils_1.DAYS * 365 * 100; // 100 years
const MIN_BOT_SLOWMODE = 15 * utils_1.MINUTES;
const validModes = ["bot", "native"];
exports.SlowmodeSetCmd = types_1.slowmodeCmd({
    trigger: "slowmode",
    permission: "can_manage",
    source: "guild",
    // prettier-ignore
    signature: [
        {
            time: commandTypes_1.commandTypeHelpers.delay(),
            mode: commandTypes_1.commandTypeHelpers.string({ option: true, shortcut: "m" }),
        },
        {
            channel: commandTypes_1.commandTypeHelpers.textChannel(),
            time: commandTypes_1.commandTypeHelpers.delay(),
            mode: commandTypes_1.commandTypeHelpers.string({ option: true, shortcut: "m" }),
        }
    ],
    async run({ message: msg, args, pluginData }) {
        const channel = args.channel || msg.channel;
        if (args.time === 0) {
            // Workaround until we can call SlowmodeDisableCmd from here
            return actualDisableSlowmodeCmd_1.actualDisableSlowmodeCmd(msg, { channel }, pluginData);
        }
        const defaultMode = (await pluginData.config.getForChannel(channel)).use_native_slowmode && args.time <= MAX_NATIVE_SLOWMODE
            ? "native"
            : "bot";
        const mode = args.mode || defaultMode;
        if (!validModes.includes(mode)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "--mode must be 'bot' or 'native'");
            return;
        }
        // Validate durations
        if (mode === "native" && args.time > MAX_NATIVE_SLOWMODE) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Native slowmode can only be set to 6h or less");
            return;
        }
        if (mode === "bot" && args.time > MAX_BOT_SLOWMODE) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Sorry, bot managed slowmodes can be at most 100 years long. Maybe 99 would be enough?`);
            return;
        }
        if (mode === "bot" && args.time < MIN_BOT_SLOWMODE) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, utils_1.asSingleLine(`
          Bot managed slowmode must be 15min or more.
          Use \`--mode native\` to use native slowmodes for short slowmodes instead.
        `));
            return;
        }
        // Verify permissions
        const channelPermissions = channel.permissionsOf(pluginData.client.user.id);
        if (mode === "native") {
            const missingPermissions = getMissingPermissions_1.getMissingPermissions(channelPermissions, requiredPermissions_1.NATIVE_SLOWMODE_PERMISSIONS);
            if (missingPermissions) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Unable to set native slowmode. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`);
                return;
            }
        }
        if (mode === "bot") {
            const missingPermissions = getMissingPermissions_1.getMissingPermissions(channelPermissions, requiredPermissions_1.BOT_SLOWMODE_PERMISSIONS);
            if (missingPermissions) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Unable to set bot managed slowmode. ${missingPermissionError_1.missingPermissionError(missingPermissions)}`);
                return;
            }
        }
        // Apply the slowmode!
        const rateLimitSeconds = Math.ceil(args.time / 1000);
        if (mode === "native") {
            // If there is an existing bot-maintained slowmode, disable that first
            const existingBotSlowmode = await pluginData.state.slowmodes.getChannelSlowmode(channel.id);
            if (existingBotSlowmode) {
                await disableBotSlowmodeForChannel_1.disableBotSlowmodeForChannel(pluginData, channel);
            }
            // Set native slowmode
            try {
                await channel.edit({
                    rateLimitPerUser: rateLimitSeconds,
                });
            }
            catch (e) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to set native slowmode: ${utils_1.disableInlineCode(e.message)}`);
                return;
            }
        }
        else {
            // If there is an existing native slowmode, disable that first
            if (channel.rateLimitPerUser) {
                await channel.edit({
                    rateLimitPerUser: 0,
                });
            }
            await pluginData.state.slowmodes.setChannelSlowmode(channel.id, rateLimitSeconds);
        }
        const humanizedSlowmodeTime = humanize_duration_1.default(args.time);
        const slowmodeType = mode === "native" ? "native slowmode" : "bot-maintained slowmode";
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Set ${humanizedSlowmodeTime} slowmode for <#${channel.id}> (${slowmodeType})`);
    },
});
