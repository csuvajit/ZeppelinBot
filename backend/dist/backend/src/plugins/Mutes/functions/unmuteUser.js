"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmuteUser = void 0;
const utils_1 = require("../../../utils");
const memberHasMutedRole_1 = require("./memberHasMutedRole");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const LogType_1 = require("../../../data/LogType");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
async function unmuteUser(pluginData, userId, unmuteTime, caseArgs = {}) {
    const existingMute = await pluginData.state.mutes.findExistingMuteForUserId(userId);
    const user = await utils_1.resolveUser(pluginData.client, userId);
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, userId); // Grab the fresh member so we don't have stale role info
    const modId = caseArgs.modId || pluginData.client.user.id;
    if (!existingMute && member && !memberHasMutedRole_1.memberHasMutedRole(pluginData, member))
        return null;
    if (unmuteTime) {
        // Schedule timed unmute (= just set the mute's duration)
        if (!existingMute) {
            await pluginData.state.mutes.addMute(userId, unmuteTime);
        }
        else {
            await pluginData.state.mutes.updateExpiryTime(userId, unmuteTime);
        }
    }
    else {
        // Unmute immediately
        if (member) {
            const lock = await pluginData.locks.acquire(lockNameHelpers_1.memberRolesLock(member));
            const muteRole = pluginData.config.get().mute_role;
            if (muteRole && member.roles.includes(muteRole)) {
                await member.removeRole(muteRole);
                member.roles = member.roles.filter(r => r !== muteRole);
            }
            if (existingMute?.roles_to_restore) {
                const memberOptions = {};
                const guildRoles = pluginData.guild.roles;
                memberOptions.roles = Array.from(new Set([...existingMute.roles_to_restore, ...member.roles.filter(x => x !== muteRole && guildRoles.has(x))]));
                await member.edit(memberOptions);
                member.roles = memberOptions.roles;
            }
            lock.unlock();
        }
        else {
            // tslint:disable-next-line:no-console
            console.warn(`Member ${userId} not found in guild ${pluginData.guild.name} (${pluginData.guild.id}) when attempting to unmute`);
        }
        if (existingMute) {
            await pluginData.state.mutes.clear(userId);
        }
    }
    const timeUntilUnmute = unmuteTime && humanize_duration_1.default(unmuteTime);
    // Create a case
    const noteDetails = [];
    if (unmuteTime) {
        noteDetails.push(`Scheduled unmute in ${timeUntilUnmute}`);
    }
    else {
        noteDetails.push(`Unmuted immediately`);
    }
    if (!existingMute) {
        noteDetails.push(`Removed external mute`);
    }
    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
    const createdCase = await casesPlugin.createCase({
        ...caseArgs,
        userId,
        modId,
        type: CaseTypes_1.CaseTypes.Unmute,
        noteDetails,
    });
    // Log the action
    const mod = pluginData.client.users.get(modId);
    if (unmuteTime) {
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_TIMED_UNMUTE, {
            mod: utils_1.stripObjectToScalars(mod),
            user: utils_1.stripObjectToScalars(user),
            caseNumber: createdCase.case_number,
            time: timeUntilUnmute,
            reason: caseArgs.reason,
        });
    }
    else {
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_UNMUTE, {
            mod: utils_1.stripObjectToScalars(mod),
            user: utils_1.stripObjectToScalars(user),
            caseNumber: createdCase.case_number,
            reason: caseArgs.reason,
        });
    }
    if (!unmuteTime) {
        // If the member was unmuted, not just scheduled to be unmuted, fire the unmute event as well
        // Scheduled unmutes have their event fired in clearExpiredMutes()
        pluginData.state.events.emit("unmute", user.id, caseArgs.reason);
    }
    return {
        case: createdCase,
    };
}
exports.unmuteUser = unmuteUser;
