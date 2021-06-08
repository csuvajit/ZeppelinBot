"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.muteUser = void 0;
const RecoverablePluginError_1 = require("../../../RecoverablePluginError");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const utils_1 = require("../../../utils");
const templateFormatter_1 = require("../../../templateFormatter");
const eris_1 = require("eris");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const LogType_1 = require("../../../data/LogType");
const LogsPlugin_1 = require("../../../plugins/Logs/LogsPlugin");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
async function muteUser(pluginData, userId, muteTime, reason, muteOptions = {}, removeRolesOnMuteOverride = null, restoreRolesOnMuteOverride = null) {
    const lock = await pluginData.locks.acquire(lockNameHelpers_1.muteLock({ id: userId }));
    const muteRole = pluginData.config.get().mute_role;
    if (!muteRole) {
        lock.unlock();
        throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.NO_MUTE_ROLE_IN_CONFIG);
    }
    const timeUntilUnmute = muteTime ? humanize_duration_1.default(muteTime) : "indefinite";
    // No mod specified -> mark Zeppelin as the mod
    if (!muteOptions.caseArgs?.modId) {
        muteOptions.caseArgs = muteOptions.caseArgs ?? {};
        muteOptions.caseArgs.modId = pluginData.client.user.id;
    }
    const user = await utils_1.resolveUser(pluginData.client, userId);
    if (!user.id) {
        lock.unlock();
        throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.INVALID_USER);
    }
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id, true); // Grab the fresh member so we don't have stale role info
    const config = await pluginData.config.getMatchingConfig({ member, userId });
    let rolesToRestore = [];
    if (member) {
        const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
        // remove and store any roles to be removed/restored
        const currentUserRoles = member.roles;
        const memberOptions = {};
        const removeRoles = removeRolesOnMuteOverride ?? config.remove_roles_on_mute;
        const restoreRoles = restoreRolesOnMuteOverride ?? config.restore_roles_on_mute;
        // remove roles
        if (!Array.isArray(removeRoles)) {
            if (removeRoles) {
                // exclude managed roles from being removed
                const managedRoles = pluginData.guild.roles.filter(x => x.managed).map(y => y.id);
                memberOptions.roles = managedRoles.filter(x => member.roles.includes(x));
                await member.edit(memberOptions);
            }
        }
        else {
            memberOptions.roles = currentUserRoles.filter(x => !removeRoles.includes(x));
            await member.edit(memberOptions);
        }
        // set roles to be restored
        if (!Array.isArray(restoreRoles)) {
            if (restoreRoles) {
                rolesToRestore = currentUserRoles;
            }
        }
        else {
            rolesToRestore = currentUserRoles.filter(x => restoreRoles.includes(x));
        }
        // Apply mute role if it's missing
        if (!member.roles.includes(muteRole)) {
            try {
                await member.addRole(muteRole);
            }
            catch (e) {
                const actualMuteRole = pluginData.guild.roles.find(x => x.id === muteRole);
                if (!actualMuteRole) {
                    lock.unlock();
                    logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Cannot mute users, specified mute role Id is invalid`,
                    });
                    throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.INVALID_MUTE_ROLE_ID);
                }
                const zep = await utils_1.resolveMember(pluginData.client, pluginData.guild, pluginData.client.user.id);
                const zepRoles = pluginData.guild.roles.filter(x => zep.roles.includes(x.id));
                // If we have roles and one of them is above the muted role, throw generic error
                if (zepRoles.length >= 0 && zepRoles.some(zepRole => zepRole.position > actualMuteRole.position)) {
                    lock.unlock();
                    logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Cannot mute user ${member.id}: ${e}`,
                    });
                    throw e;
                }
                else {
                    // Otherwise, throw error that mute role is above zeps roles
                    lock.unlock();
                    logs.log(LogType_1.LogType.BOT_ALERT, {
                        body: `Cannot mute users, specified mute role is above Zeppelin in the role hierarchy`,
                    });
                    throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.MUTE_ROLE_ABOVE_ZEP);
                }
            }
        }
        // If enabled, move the user to the mute voice channel (e.g. afk - just to apply the voice perms from the mute role)
        const cfg = pluginData.config.get();
        const moveToVoiceChannel = cfg.kick_from_voice_channel ? null : cfg.move_to_voice_channel;
        if (moveToVoiceChannel || cfg.kick_from_voice_channel) {
            // TODO: Add back the voiceState check once we figure out how to get voice state for guild members that are loaded on-demand
            try {
                await member.edit({ channelID: moveToVoiceChannel });
            }
            catch { } // tslint:disable-line
        }
    }
    // If the user is already muted, update the duration of their existing mute
    const existingMute = await pluginData.state.mutes.findExistingMuteForUserId(user.id);
    let notifyResult = { method: null, success: true };
    if (existingMute) {
        if (existingMute.roles_to_restore?.length || rolesToRestore?.length) {
            rolesToRestore = Array.from(new Set([...existingMute.roles_to_restore, ...rolesToRestore]));
        }
        await pluginData.state.mutes.updateExpiryTime(user.id, muteTime, rolesToRestore);
    }
    else {
        await pluginData.state.mutes.addMute(user.id, muteTime, rolesToRestore);
    }
    const template = existingMute
        ? config.update_mute_message
        : muteTime
            ? config.timed_mute_message
            : config.mute_message;
    const muteMessage = template &&
        (await templateFormatter_1.renderTemplate(template, {
            guildName: pluginData.guild.name,
            reason: reason || "None",
            time: timeUntilUnmute,
            moderator: muteOptions.caseArgs?.modId
                ? utils_1.stripObjectToScalars(await utils_1.resolveUser(pluginData.client, muteOptions.caseArgs.modId))
                : "",
        }));
    if (muteMessage && user instanceof eris_1.User) {
        let contactMethods = [];
        if (muteOptions?.contactMethods) {
            contactMethods = muteOptions.contactMethods;
        }
        else {
            const useDm = existingMute ? config.dm_on_update : config.dm_on_mute;
            if (useDm) {
                contactMethods.push({ type: "dm" });
            }
            const useChannel = existingMute ? config.message_on_update : config.message_on_mute;
            const channel = config.message_channel && pluginData.guild.channels.get(config.message_channel);
            if (useChannel && channel instanceof eris_1.TextChannel) {
                contactMethods.push({ type: "channel", channel });
            }
        }
        notifyResult = await utils_1.notifyUser(user, muteMessage, contactMethods);
    }
    // Create/update a case
    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
    let theCase = existingMute && existingMute.case_id ? await pluginData.state.cases.find(existingMute.case_id) : undefined;
    if (theCase) {
        // Update old case
        const noteDetails = [`Mute updated to ${muteTime ? timeUntilUnmute : "indefinite"}`];
        const reasons = reason ? [reason] : [];
        if (muteOptions.caseArgs?.extraNotes) {
            reasons.push(...muteOptions.caseArgs.extraNotes);
        }
        for (const noteReason of reasons) {
            await casesPlugin.createCaseNote({
                caseId: existingMute.case_id,
                modId: muteOptions.caseArgs?.modId,
                body: noteReason,
                noteDetails,
                postInCaseLogOverride: muteOptions.caseArgs?.postInCaseLogOverride,
            });
        }
    }
    else {
        // Create new case
        const noteDetails = [`Muted ${muteTime ? `for ${timeUntilUnmute}` : "indefinitely"}`];
        if (notifyResult.text) {
            noteDetails.push(utils_1.ucfirst(notifyResult.text));
        }
        theCase = await casesPlugin.createCase({
            ...(muteOptions.caseArgs || {}),
            userId,
            modId: muteOptions.caseArgs?.modId,
            type: CaseTypes_1.CaseTypes.Mute,
            reason,
            noteDetails,
        });
        await pluginData.state.mutes.setCaseId(user.id, theCase.id);
    }
    // Log the action
    const mod = await utils_1.resolveUser(pluginData.client, muteOptions.caseArgs?.modId);
    if (muteTime) {
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_TIMED_MUTE, {
            mod: utils_1.stripObjectToScalars(mod),
            user: utils_1.stripObjectToScalars(user),
            time: timeUntilUnmute,
            caseNumber: theCase.case_number,
            reason,
        });
    }
    else {
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_MUTE, {
            mod: utils_1.stripObjectToScalars(mod),
            user: utils_1.stripObjectToScalars(user),
            caseNumber: theCase.case_number,
            reason,
        });
    }
    lock.unlock();
    pluginData.state.events.emit("mute", user.id, reason, muteOptions.isAutomodAction);
    return {
        case: theCase,
        notifyResult,
        updatedExistingMute: !!existingMute,
    };
}
exports.muteUser = muteUser;
