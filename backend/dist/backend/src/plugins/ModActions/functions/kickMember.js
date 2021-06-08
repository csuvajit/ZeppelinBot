"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kickMember = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const templateFormatter_1 = require("../../../templateFormatter");
const getDefaultContactMethods_1 = require("./getDefaultContactMethods");
const LogType_1 = require("../../../data/LogType");
const ignoreEvent_1 = require("./ignoreEvent");
const CaseTypes_1 = require("../../../data/CaseTypes");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
/**
 * Kick the specified server member. Generates a case.
 */
async function kickMember(pluginData, member, reason, kickOptions = {}) {
    const config = pluginData.config.get();
    // Attempt to message the user *before* kicking them, as doing it after may not be possible
    let notifyResult = { method: null, success: true };
    if (reason) {
        const contactMethods = kickOptions?.contactMethods
            ? kickOptions.contactMethods
            : getDefaultContactMethods_1.getDefaultContactMethods(pluginData, "kick");
        if (contactMethods.length) {
            if (config.kick_message) {
                const kickMessage = await templateFormatter_1.renderTemplate(config.kick_message, {
                    guildName: pluginData.guild.name,
                    reason,
                    moderator: kickOptions.caseArgs?.modId
                        ? utils_1.stripObjectToScalars(await utils_1.resolveUser(pluginData.client, kickOptions.caseArgs.modId))
                        : {},
                });
                notifyResult = await utils_1.notifyUser(member.user, kickMessage, contactMethods);
            }
            else {
                notifyResult = utils_1.createUserNotificationError("No kick message specified in the config");
            }
        }
    }
    // Kick the user
    pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_KICK, member.id);
    ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Kick, member.id);
    try {
        await member.kick(reason != null ? encodeURIComponent(reason) : undefined);
    }
    catch (e) {
        return {
            status: "failed",
            error: e.message,
        };
    }
    const modId = kickOptions.caseArgs?.modId || pluginData.client.user.id;
    // Create a case for this action
    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
    const createdCase = await casesPlugin.createCase({
        ...(kickOptions.caseArgs || {}),
        userId: member.id,
        modId,
        type: CaseTypes_1.CaseTypes.Kick,
        reason,
        noteDetails: notifyResult.text ? [utils_1.ucfirst(notifyResult.text)] : [],
    });
    // Log the action
    const mod = await utils_1.resolveUser(pluginData.client, modId);
    pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_KICK, {
        mod: utils_1.stripObjectToScalars(mod),
        user: utils_1.stripObjectToScalars(member.user),
        caseNumber: createdCase.case_number,
        reason,
    });
    pluginData.state.events.emit("kick", member.id, reason, kickOptions.isAutomodAction);
    return {
        status: "success",
        case: createdCase,
        notifyResult,
    };
}
exports.kickMember = kickMember;
