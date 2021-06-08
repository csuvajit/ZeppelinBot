"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const formatReasonWithAttachments_1 = require("../functions/formatReasonWithAttachments");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const LogType_1 = require("../../../data/LogType");
const CaseTypes_1 = require("../../../data/CaseTypes");
const utils_1 = require("../../../utils");
exports.NoteCmd = types_1.modActionsCmd({
    trigger: "note",
    permission: "can_note",
    description: "Add a note to the specified user",
    signature: {
        user: commandTypes_1.commandTypeHelpers.string(),
        note: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
    },
    async run({ pluginData, message: msg, args }) {
        const user = await utils_1.resolveUser(pluginData.client, args.user);
        if (!user.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found`);
            return;
        }
        if (!args.note && msg.attachments.length === 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Text or attachment required");
            return;
        }
        const userName = `${user.username}#${user.discriminator}`;
        const reason = formatReasonWithAttachments_1.formatReasonWithAttachments(args.note, msg.attachments);
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const createdCase = await casesPlugin.createCase({
            userId: user.id,
            modId: msg.author.id,
            type: CaseTypes_1.CaseTypes.Note,
            reason,
        });
        pluginData.state.serverLogs.log(LogType_1.LogType.MEMBER_NOTE, {
            mod: utils_1.stripObjectToScalars(msg.author),
            user: utils_1.stripObjectToScalars(user, ["user", "roles"]),
            caseNumber: createdCase.case_number,
            reason,
        });
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Note added on **${userName}** (Case #${createdCase.case_number})`);
        pluginData.state.events.emit("note", user.id, reason);
    },
});
