"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCaseCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const CaseTypes_1 = require("../../../data/CaseTypes");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const LogType_1 = require("../../../data/LogType");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.member({ option: true }),
};
exports.AddCaseCmd = types_1.modActionsCmd({
    trigger: "addcase",
    permission: "can_addcase",
    description: "Add an arbitrary case to the specified user without taking any action",
    signature: [
        {
            type: commandTypes_1.commandTypeHelpers.string(),
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
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot add case on this user: insufficient permissions");
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
        // Verify the case type is valid
        const type = args.type[0].toUpperCase() + args.type.slice(1).toLowerCase();
        if (!CaseTypes_1.CaseTypes[type]) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Cannot add case: invalid case type");
            return;
        }
        const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(args.reason, msg.attachments);
        // Create the case
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const theCase = await casesPlugin.createCase({
            userId: user.id,
            modId: mod.id,
            type: CaseTypes_1.CaseTypes[type],
            reason,
            ppId: mod.id !== msg.author.id ? msg.author.id : undefined,
        });
        if (user) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Case #${theCase.case_number} created for **${user.username}#${user.discriminator}**`);
        }
        else {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Case #${theCase.case_number} created`);
        }
        // Log the action
        pluginData.state.serverLogs.log(LogType_1.LogType.CASE_CREATE, {
            mod: utils_1.stripObjectToScalars(mod.user),
            userId: user.id,
            caseNum: theCase.case_number,
            caseType: type.toUpperCase(),
            reason,
        });
    },
});
