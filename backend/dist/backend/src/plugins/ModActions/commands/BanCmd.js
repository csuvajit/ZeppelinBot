"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const isBanned_1 = require("../functions/isBanned");
const readContactMethodsFromArgs_1 = require("../functions/readContactMethodsFromArgs");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const banUserId_1 = require("../functions/banUserId");
const helpers_1 = require("knub/dist/helpers");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const LogType_1 = require("../../../data/LogType");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
    notify: commandTypes_1.commandTypeHelpers.string({ option: true }),
    "notify-channel": commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
    "delete-days": commandTypes_1.commandTypeHelpers.number({ option: true, shortcut: "d" }),
};
exports.BanCmd = types_1.modActionsCmd({
    trigger: "ban",
    permission: "can_ban",
    description: "Ban or Tempban the specified member",
    signature: [
        {
            user: commandTypes_1.commandTypeHelpers.string(),
            time: commandTypes_1.commandTypeHelpers.delay(),
            reason: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
            ...opts,
        },
        {
            user: commandTypes_1.commandTypeHelpers.string(),
            reason: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
            ...opts,
        },
    ],
    async run({ pluginData, message: msg, args }) {
        const user = await utils_1.resolveUser(pluginData.client, args.user);
        if (!user.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found`);
            return;
        }
        const time = args["time"] ? args["time"] : null;
        const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments);
        const memberToBan = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
        // The moderator who did the action is the message author or, if used, the specified -mod
        let mod = msg.member;
        if (args.mod) {
            if (!(await pluginUtils_1.hasPermission(pluginData, "can_act_as_other", { message: msg, channelId: msg.channel.id }))) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You don't have permission to use -mod");
                return;
            }
            mod = args.mod;
        }
        // acquire a lock because of the needed user-inputs below (if banned/not on server)
        const lock = await pluginData.locks.acquire(lockNameHelpers_1.banLock(user));
        let forceban = false;
        const existingTempban = await pluginData.state.tempbans.findExistingTempbanForUserId(user.id);
        if (!memberToBan) {
            const banned = await isBanned_1.isBanned(pluginData, user.id);
            if (banned) {
                // Abort if trying to ban user indefinitely if they are already banned indefinitely
                if (!existingTempban && !time) {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User is already banned indefinitely.`);
                    return;
                }
                // Ask the mod if we should update the existing ban
                const alreadyBannedMsg = await msg.channel.createMessage("User is already banned, update ban?");
                const reply = await helpers_1.waitForReaction(pluginData.client, alreadyBannedMsg, ["✅", "❌"], msg.author.id);
                alreadyBannedMsg.delete().catch(utils_1.noop);
                if (!reply || reply.name === "❌") {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "User already banned, update cancelled by moderator");
                    lock.unlock();
                    return;
                }
                else {
                    // Update or add new tempban / remove old tempban
                    if (time && time > 0) {
                        if (existingTempban) {
                            pluginData.state.tempbans.updateExpiryTime(user.id, time, mod.id);
                        }
                        else {
                            pluginData.state.tempbans.addTempban(user.id, time, mod.id);
                        }
                    }
                    else if (existingTempban) {
                        pluginData.state.tempbans.clear(user.id);
                    }
                    // Create a new case for the updated ban since we never stored the old case id and log the action
                    const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
                    const createdCase = await casesPlugin.createCase({
                        modId: mod.id,
                        type: CaseTypes_1.CaseTypes.Ban,
                        userId: user.id,
                        reason,
                        noteDetails: [`Ban updated to ${time ? humanize_duration_1.default(time) : "indefinite"}`],
                    });
                    const logtype = time ? LogType_1.LogType.MEMBER_TIMED_BAN : LogType_1.LogType.MEMBER_BAN;
                    pluginData.state.serverLogs.log(logtype, {
                        mod: utils_1.stripObjectToScalars(mod.user),
                        user: utils_1.stripObjectToScalars(user),
                        caseNumber: createdCase.case_number,
                        reason,
                        banTime: time ? humanize_duration_1.default(time) : null,
                    });
                    pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Ban updated to ${time ? "expire in " + humanize_duration_1.default(time) + " from now" : "indefinite"}`);
                    lock.unlock();
                    return;
                }
            }
            else {
                // Ask the mod if we should upgrade to a forceban as the user is not on the server
                const notOnServerMsg = await msg.channel.createMessage("User not found on the server, forceban instead?");
                const reply = await helpers_1.waitForReaction(pluginData.client, notOnServerMsg, ["✅", "❌"], msg.author.id);
                notOnServerMsg.delete().catch(utils_1.noop);
                if (!reply || reply.name === "❌") {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "User not on server, ban cancelled by moderator");
                    lock.unlock();
                    return;
                }
                else {
                    forceban = true;
                }
            }
        }
        // Make sure we're allowed to ban this member if they are on the server
        if (!forceban && !pluginUtils_1.canActOn(pluginData, msg.member, memberToBan)) {
            const ourLevel = helpers_1.getMemberLevel(pluginData, msg.member);
            const targetLevel = helpers_1.getMemberLevel(pluginData, memberToBan);
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Cannot ban: target permission level is equal or higher to yours, ${targetLevel} >= ${ourLevel}`);
            lock.unlock();
            return;
        }
        let contactMethods;
        try {
            contactMethods = readContactMethodsFromArgs_1.readContactMethodsFromArgs(args);
        }
        catch (e) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
            lock.unlock();
            return;
        }
        const deleteMessageDays = args["delete-days"] ?? (await pluginData.config.getForMessage(msg)).ban_delete_message_days;
        const banResult = await banUserId_1.banUserId(pluginData, user.id, reason, {
            contactMethods,
            caseArgs: {
                modId: mod.id,
                ppId: mod.id !== msg.author.id ? msg.author.id : undefined,
            },
            deleteMessageDays,
            modId: mod.id,
        }, time);
        if (banResult.status === "failed") {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to ban member: ${banResult.error}`);
            lock.unlock();
            return;
        }
        let forTime = "";
        if (time && time > 0) {
            forTime = `for ${humanize_duration_1.default(time)} `;
        }
        // Confirm the action to the moderator
        let response = "";
        if (!forceban) {
            response = `Banned **${user.username}#${user.discriminator}** ${forTime}(Case #${banResult.case.case_number})`;
            if (banResult.notifyResult.text)
                response += ` (${banResult.notifyResult.text})`;
        }
        else {
            response = `Member forcebanned ${forTime}(Case #${banResult.case.case_number})`;
        }
        lock.unlock();
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, response);
    },
});
