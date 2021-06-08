"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.banUserId = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const eris_1 = require("eris");
const templateFormatter_1 = require("../../../templateFormatter");
const getDefaultContactMethods_1 = require("./getDefaultContactMethods");
const LogType_1 = require("../../../data/LogType");
const ignoreEvent_1 = require("./ignoreEvent");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const logger_1 = require("../../../logger");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
/**
 * Ban the specified user id, whether or not they're actually on the server at the time. Generates a case.
 */
async function banUserId(pluginData, userId, reason, banOptions = {}, banTime) {
    const config = pluginData.config.get();
    const user = await utils_1.resolveUser(pluginData.client, userId);
    if (!user.id) {
        return {
            status: "failed",
            error: "Invalid user",
        };
    }
    // Attempt to message the user *before* banning them, as doing it after may not be possible
    let notifyResult = { method: null, success: true };
    if (reason && user instanceof eris_1.User) {
        const contactMethods = banOptions?.contactMethods
            ? banOptions.contactMethods
            : getDefaultContactMethods_1.getDefaultContactMethods(pluginData, "ban");
        if (contactMethods.length) {
            if (!banTime && config.ban_message) {
                const banMessage = await templateFormatter_1.renderTemplate(config.ban_message, {
                    guildName: pluginData.guild.name,
                    reason,
                    moderator: banOptions.caseArgs?.modId
                        ? utils_1.stripObjectToScalars(await utils_1.resolveUser(pluginData.client, banOptions.caseArgs.modId))
                        : {},
                });
                notifyResult = await utils_1.notifyUser(user, banMessage, contactMethods);
            }
            else if (banTime && config.tempban_message) {
                const banMessage = await templateFormatter_1.renderTemplate(config.tempban_message, {
                    guildName: pluginData.guild.name,
                    reason,
                    moderator: banOptions.caseArgs?.modId
                        ? utils_1.stripObjectToScalars(await utils_1.resolveUser(pluginData.client, banOptions.caseArgs.modId))
                        : {},
                    banTime: humanize_duration_1.default(banTime),
                });
                notifyResult = await utils_1.notifyUser(user, banMessage, contactMethods);
            }
            else {
                notifyResult = utils_1.createUserNotificationError("No ban/tempban message specified in config");
            }
        }
    }
    // (Try to) ban the user
    pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_BAN, userId);
    ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Ban, userId);
    try {
        const deleteMessageDays = Math.min(30, Math.max(0, banOptions.deleteMessageDays ?? 1));
        await pluginData.guild.banMember(userId, deleteMessageDays, reason != null ? encodeURIComponent(reason) : undefined);
    }
    catch (e) {
        let errorMessage;
        if (e instanceof eris_1.DiscordRESTError) {
            errorMessage = `API error ${e.code}: ${e.message}`;
        }
        else {
            logger_1.logger.warn(`Error applying ban to ${userId}: ${e}`);
            errorMessage = "Unknown error";
        }
        return {
            status: "failed",
            error: errorMessage,
        };
    }
    const existingTempban = await pluginData.state.tempbans.findExistingTempbanForUserId(user.id);
    if (banTime && banTime > 0) {
        const selfId = pluginData.client.user.id;
        if (existingTempban) {
            pluginData.state.tempbans.updateExpiryTime(user.id, banTime, banOptions.modId ?? selfId);
        }
        else {
            pluginData.state.tempbans.addTempban(user.id, banTime, banOptions.modId ?? selfId);
        }
    }
    // Create a case for this action
    const modId = banOptions.caseArgs?.modId || pluginData.client.user.id;
    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
    const noteDetails = [];
    const timeUntilUnban = banTime ? humanize_duration_1.default(banTime) : "indefinite";
    const timeDetails = `Banned ${banTime ? `for ${timeUntilUnban}` : "indefinitely"}`;
    if (notifyResult.text)
        noteDetails.push(utils_1.ucfirst(notifyResult.text));
    noteDetails.push(timeDetails);
    const createdCase = await casesPlugin.createCase({
        ...(banOptions.caseArgs || {}),
        userId,
        modId,
        type: CaseTypes_1.CaseTypes.Ban,
        reason,
        noteDetails,
    });
    // Log the action
    const mod = await utils_1.resolveUser(pluginData.client, modId);
    const logtype = banTime ? LogType_1.LogType.MEMBER_TIMED_BAN : LogType_1.LogType.MEMBER_BAN;
    pluginData.state.serverLogs.log(logtype, {
        mod: utils_1.stripObjectToScalars(mod),
        user: utils_1.stripObjectToScalars(user),
        caseNumber: createdCase.case_number,
        reason,
        banTime: banTime ? humanize_duration_1.default(banTime) : null,
    });
    pluginData.state.events.emit("ban", user.id, reason, banOptions.isAutomodAction);
    return {
        status: "success",
        case: createdCase,
        notifyResult,
    };
}
exports.banUserId = banUserId;
