"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarnCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const CaseTypes_1 = require("../../../data/CaseTypes");
const utils_1 = require("../../../utils");
const isBanned_1 = require("../functions/isBanned");
const helpers_1 = require("knub/dist/helpers");
const readContactMethodsFromArgs_1 = require("../functions/readContactMethodsFromArgs");
const warnMember_1 = require("../functions/warnMember");
exports.WarnCmd = types_1.modActionsCmd({
    trigger: "warn",
    permission: "can_warn",
    description: "Send a warning to the specified user",
    signature: {
        user: commandTypes_1.commandTypeHelpers.string(),
        reason: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
        mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
        notify: commandTypes_1.commandTypeHelpers.string({ option: true }),
        "notify-channel": commandTypes_1.commandTypeHelpers.textChannel({ option: true }),
    },
    async run({ pluginData, message: msg, args }) {
        const user = await utils_1.resolveUser(pluginData.client, args.user);
        if (!user.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found`);
            return;
        }
        const memberToWarn = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
        if (!memberToWarn) {
            const _isBanned = await isBanned_1.isBanned(pluginData, user.id);
            if (_isBanned) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User is banned`);
            }
            else {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found on the server`);
            }
            return;
        }
        // Make sure we're allowed to warn this member
        if (!pluginUtils_1.canActOn(pluginData, msg.member, memberToWarn)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot warn: insufficient permissions");
            return;
        }
        // The moderator who did the action is the message author or, if used, the specified -mod
        let mod = msg.member;
        if (args.mod) {
            if (!(await pluginUtils_1.hasPermission(pluginData, "can_act_as_other", { message: msg }))) {
                msg.channel.createMessage(utils_1.errorMessage("You don't have permission to use -mod"));
                return;
            }
            mod = args.mod;
        }
        const config = pluginData.config.get();
        const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments);
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const priorWarnAmount = await casesPlugin.getCaseTypeAmountForUserId(memberToWarn.id, CaseTypes_1.CaseTypes.Warn);
        if (config.warn_notify_enabled && priorWarnAmount >= config.warn_notify_threshold) {
            const tooManyWarningsMsg = await msg.channel.createMessage(config.warn_notify_message.replace("{priorWarnings}", `${priorWarnAmount}`));
            const reply = await helpers_1.waitForReaction(pluginData.client, tooManyWarningsMsg, ["✅", "❌"], msg.author.id);
            tooManyWarningsMsg.delete();
            if (!reply || reply.name === "❌") {
                msg.channel.createMessage(utils_1.errorMessage("Warn cancelled by moderator"));
                return;
            }
        }
        let contactMethods;
        try {
            contactMethods = readContactMethodsFromArgs_1.readContactMethodsFromArgs(args);
        }
        catch (e) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, e.message);
            return;
        }
        const warnResult = await warnMember_1.warnMember(pluginData, memberToWarn, reason, {
            contactMethods,
            caseArgs: {
                modId: mod.id,
                ppId: mod.id !== msg.author.id ? msg.author.id : undefined,
                reason,
            },
            retryPromptChannel: msg.channel,
        });
        if (warnResult.status === "failed") {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Failed to warn user");
            return;
        }
        const messageResultText = warnResult.notifyResult.text ? ` (${warnResult.notifyResult.text})` : "";
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Warned **${memberToWarn.user.username}#${memberToWarn.user.discriminator}** (Case #${warnResult.case.case_number})${messageResultText}`);
    },
});
