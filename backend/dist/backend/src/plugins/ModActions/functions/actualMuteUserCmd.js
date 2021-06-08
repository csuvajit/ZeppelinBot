"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualMuteUserCmd = void 0;
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const formatReasonWithAttachments_1 = require("./formatReasonWithAttachments");
const MutesPlugin_1 = require("../../Mutes/MutesPlugin");
const readContactMethodsFromArgs_1 = require("./readContactMethodsFromArgs");
const RecoverablePluginError_1 = require("../../../RecoverablePluginError");
const logger_1 = require("../../../logger");
/**
 * The actual function run by both !mute and !forcemute.
 * The only difference between the two commands is in target member validation.
 */
async function actualMuteUserCmd(pluginData, user, msg, args) {
    // The moderator who did the action is the message author or, if used, the specified -mod
    let mod = msg.member;
    let pp = null;
    if (args.mod) {
        if (!(await pluginUtils_1.hasPermission(pluginData, "can_act_as_other", { message: msg }))) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You don't have permission to use -mod");
            return;
        }
        mod = args.mod;
        pp = msg.author;
    }
    const timeUntilUnmute = args.time && humanize_duration_1.default(args.time);
    const reason = args.reason ? formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments) : undefined;
    let muteResult;
    const mutesPlugin = pluginData.getPlugin(MutesPlugin_1.MutesPlugin);
    let contactMethods;
    try {
        contactMethods = readContactMethodsFromArgs_1.readContactMethodsFromArgs(args);
    }
    catch (e) {
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
        return;
    }
    try {
        muteResult = await mutesPlugin.muteUser(user.id, args.time, reason, {
            contactMethods,
            caseArgs: {
                modId: mod.id,
                ppId: pp ? pp.id : undefined,
            },
        });
    }
    catch (e) {
        if (e instanceof RecoverablePluginError_1.RecoverablePluginError && e.code === RecoverablePluginError_1.ERRORS.NO_MUTE_ROLE_IN_CONFIG) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Could not mute the user: no mute role set in config");
        }
        else if (utils_1.isDiscordRESTError(e) && e.code === 10007) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Could not mute the user: unknown member");
        }
        else {
            logger_1.logger.error(`Failed to mute user ${user.id}: ${e.stack}`);
            if (user.id == null) {
                // tslint-disable-next-line:no-console
                console.trace("[DEBUG] Null user.id for mute");
            }
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Could not mute the user");
        }
        return;
    }
    // Confirm the action to the moderator
    let response;
    if (args.time) {
        if (muteResult.updatedExistingMute) {
            response = utils_1.asSingleLine(`
        Updated **${user.username}#${user.discriminator}**'s
        mute to ${timeUntilUnmute} (Case #${muteResult.case.case_number})
      `);
        }
        else {
            response = utils_1.asSingleLine(`
        Muted **${user.username}#${user.discriminator}**
        for ${timeUntilUnmute} (Case #${muteResult.case.case_number})
      `);
        }
    }
    else {
        if (muteResult.updatedExistingMute) {
            response = utils_1.asSingleLine(`
        Updated **${user.username}#${user.discriminator}**'s
        mute to indefinite (Case #${muteResult.case.case_number})
      `);
        }
        else {
            response = utils_1.asSingleLine(`
        Muted **${user.username}#${user.discriminator}**
        indefinitely (Case #${muteResult.case.case_number})
      `);
        }
    }
    if (muteResult.notifyResult.text)
        response += ` (${muteResult.notifyResult.text})`;
    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, response);
}
exports.actualMuteUserCmd = actualMuteUserCmd;
