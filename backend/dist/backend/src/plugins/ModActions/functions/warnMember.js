"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnMember = void 0;
const getDefaultContactMethods_1 = require("./getDefaultContactMethods");
const utils_1 = require("../../../utils");
const helpers_1 = require("knub/dist/helpers");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const LogType_1 = require("../../../data/LogType");
const templateFormatter_1 = require("../../../templateFormatter");
async function warnMember(pluginData, member, reason, warnOptions = {}) {
    const config = pluginData.config.get();
    let notifyResult;
    if (config.warn_message) {
        const warnMessage = await templateFormatter_1.renderTemplate(config.warn_message, {
            guildName: pluginData.guild.name,
            reason,
            moderator: warnOptions.caseArgs?.modId
                ? utils_1.stripObjectToScalars(await utils_1.resolveUser(pluginData.client, warnOptions.caseArgs.modId))
                : {},
        });
        const contactMethods = warnOptions?.contactMethods
            ? warnOptions.contactMethods
            : getDefaultContactMethods_1.getDefaultContactMethods(pluginData, "warn");
        notifyResult = await utils_1.notifyUser(member.user, warnMessage, contactMethods);
    }
    else {
        notifyResult = utils_1.createUserNotificationError("No warn message specified in config");
    }
    if (!notifyResult.success) {
        if (warnOptions.retryPromptChannel && pluginData.guild.channels.has(warnOptions.retryPromptChannel.id)) {
            const failedMsg = await warnOptions.retryPromptChannel.createMessage("Failed to message the user. Log the warning anyway?");
            const reply = await helpers_1.waitForReaction(pluginData.client, failedMsg, ["✅", "❌"]);
            failedMsg.delete();
            if (!reply || reply.name === "❌") {
                return {
                    status: "failed",
                    error: "Failed to message user",
                };
            }
        }
        else {
            return {
                status: "failed",
                error: "Failed to message user",
            };
        }
    }
    const modId = warnOptions.caseArgs?.modId ?? pluginData.client.user.id;
    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
    const createdCase = await casesPlugin.createCase({
        ...(warnOptions.caseArgs || {}),
        userId: member.id,
        modId,
        type: CaseTypes_1.CaseTypes.Warn,
        reason,
        noteDetails: notifyResult.text ? [utils_1.ucfirst(notifyResult.text)] : [],
    });
    const mod = await utils_1.resolveUser(pluginData.client, modId);
    pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_WARN, {
        mod: utils_1.stripObjectToScalars(mod),
        member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
        caseNumber: createdCase.case_number,
        reason,
    });
    pluginData.state.events.emit("warn", member.id, reason, warnOptions.isAutomodAction);
    return {
        status: "success",
        case: createdCase,
        notifyResult,
    };
}
exports.warnMember = warnMember;
