"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForcebanCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const isBanned_1 = require("../functions/isBanned");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const ignoreEvent_1 = require("../functions/ignoreEvent");
const LogType_1 = require("../../../data/LogType");
const CaseTypes_1 = require("../../../data/CaseTypes");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
};
exports.ForcebanCmd = types_1.modActionsCmd({
    trigger: "forceban",
    permission: "can_ban",
    description: "Force-ban the specified user, even if they aren't on the server",
    signature: [
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
        // If the user exists as a guild member, make sure we can act on them first
        const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
        if (member && !pluginUtils_1.canActOn(pluginData, msg.member, member)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot forceban this user: insufficient permissions");
            return;
        }
        // Make sure the user isn't already banned
        const banned = await isBanned_1.isBanned(pluginData, user.id);
        if (banned) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User is already banned`);
            return;
        }
        // The moderator who did the action is the message author or, if used, the specified -mod
        let mod = msg.member;
        if (args.mod) {
            if (!(await pluginUtils_1.hasPermission(pluginData, "can_act_as_other", { message: msg }))) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You don't have permission to use -mod");
                return;
            }
            mod = args.mod;
        }
        const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments);
        ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Ban, user.id);
        pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_BAN, user.id);
        try {
            // FIXME: Use banUserId()?
            await pluginData.guild.banMember(user.id, 1, reason != null ? encodeURIComponent(reason) : undefined);
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Failed to forceban member");
            return;
        }
        // Create a case
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const createdCase = await casesPlugin.createCase({
            userId: user.id,
            modId: mod.id,
            type: CaseTypes_1.CaseTypes.Ban,
            reason,
            ppId: mod.id !== msg.author.id ? msg.author.id : undefined,
        });
        // Confirm the action
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Member forcebanned (Case #${createdCase.case_number})`);
        // Log the action
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_FORCEBAN, {
            mod: utils_1.stripObjectToScalars(mod.user),
            userId: user.id,
            caseNumber: createdCase.case_number,
            reason,
        });
        pluginData.state.events.emit("ban", user.id, reason);
    },
});
