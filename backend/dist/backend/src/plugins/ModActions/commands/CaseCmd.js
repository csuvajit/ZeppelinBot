"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
exports.CaseCmd = types_1.modActionsCmd({
    trigger: "case",
    permission: "can_view",
    description: "Show information about a specific case",
    signature: [
        {
            caseNumber: commandTypes_1.commandTypeHelpers.number(),
        },
    ],
    async run({ pluginData, message: msg, args }) {
        const theCase = await pluginData.state.cases.findByCaseNumber(args.caseNumber);
        if (!theCase) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Case not found");
            return;
        }
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const embed = await casesPlugin.getCaseEmbed(theCase.id, msg.author.id);
        msg.channel.createMessage(embed);
    },
});
