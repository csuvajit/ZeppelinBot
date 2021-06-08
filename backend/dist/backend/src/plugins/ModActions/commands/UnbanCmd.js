"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbanCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const LogType_1 = require("../../../data/LogType");
const ignoreEvent_1 = require("../functions/ignoreEvent");
const CaseTypes_1 = require("../../../data/CaseTypes");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
};
exports.UnbanCmd = types_1.modActionsCmd({
    trigger: "unban",
    permission: "can_unban",
    description: "Unban the specified member",
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
        // The moderator who did the action is the message author or, if used, the specified -mod
        let mod = msg.member;
        if (args.mod) {
            if (!(await pluginUtils_1.hasPermission(pluginData, "can_act_as_other", { message: msg, channelId: msg.channel.id }))) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "You don't have permission to use -mod");
                return;
            }
            mod = args.mod;
        }
        pluginData.state.serverLogs.ignoreLog(LogType_1.LogType.MEMBER_UNBAN, user.id);
        const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments);
        try {
            ignoreEvent_1.ignoreEvent(pluginData, types_1.IgnoredEventType.Unban, user.id);
            await pluginData.guild.unbanMember(user.id, reason != null ? encodeURIComponent(reason) : undefined);
        }
        catch {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Failed to unban member; are you sure they're banned?");
            return;
        }
        // Create a case
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const createdCase = await casesPlugin.createCase({
            userId: user.id,
            modId: mod.id,
            type: CaseTypes_1.CaseTypes.Unban,
            reason,
            ppId: mod.id !== msg.author.id ? msg.author.id : undefined,
        });
        // Delete the tempban, if one exists
        pluginData.state.tempbans.clear(user.id);
        // Confirm the action
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Member unbanned (Case #${createdCase.case_number})`);
        // Log the action
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_UNBAN, {
            mod: utils_1.stripObjectToScalars(mod.user),
            userId: user.id,
            caseNumber: createdCase.case_number,
            reason,
        });
        pluginData.state.events.emit("unban", user.id);
    },
});
