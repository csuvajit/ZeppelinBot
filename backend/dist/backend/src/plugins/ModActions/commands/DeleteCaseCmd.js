"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCaseCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const knub_1 = require("knub");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const utils_1 = require("../../../utils");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
exports.DeleteCaseCmd = types_1.modActionsCmd({
    trigger: ["delete_case", "deletecase"],
    permission: "can_deletecase",
    description: utils_1.trimLines(`
    Delete the specified case. This operation can *not* be reversed.
    It is generally recommended to use \`!hidecase\` instead when possible.
  `),
    signature: {
        caseNumber: commandTypes_1.commandTypeHelpers.number({ rest: true }),
        force: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "f" }),
    },
    async run({ pluginData, message, args }) {
        const failed = [];
        const validCases = [];
        let cancelled = 0;
        for (const num of args.caseNumber) {
            const theCase = await pluginData.state.cases.findByCaseNumber(num);
            if (!theCase) {
                failed.push(num);
                continue;
            }
            validCases.push(theCase);
        }
        if (failed.length === args.caseNumber.length) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "None of the cases were found!");
            return;
        }
        for (const theCase of validCases) {
            if (!args.force) {
                const cases = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
                const embedContent = await cases.getCaseEmbed(theCase);
                message.channel.createMessage({
                    content: "Delete the following case? Answer 'Yes' to continue, 'No' to cancel.",
                    embed: embedContent.embed,
                });
                const reply = await knub_1.helpers.waitForReply(pluginData.client, message.channel, message.author.id, 15 * utils_1.SECONDS);
                const normalizedReply = (reply?.content || "").toLowerCase().trim();
                if (normalizedReply !== "yes" && normalizedReply !== "y") {
                    message.channel.createMessage("Cancelled. Case was not deleted.");
                    cancelled++;
                    continue;
                }
            }
            const deletedByName = `${message.author.username}#${message.author.discriminator}`;
            const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
            const deletedAt = timeAndDate.inGuildTz().format(timeAndDate.getDateFormat("pretty_datetime"));
            await pluginData.state.cases.softDelete(theCase.id, message.author.id, deletedByName, `Case deleted by **${deletedByName}** (\`${message.author.id}\`) on ${deletedAt}`);
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            logs.log(LogType_1.LogType.CASE_DELETE, {
                mod: utils_1.stripObjectToScalars(message.member, ["user", "roles"]),
                case: utils_1.stripObjectToScalars(theCase),
            });
        }
        const failedAddendum = failed.length > 0
            ? `\nThe following cases were not found: ${failed.toString().replace(new RegExp(",", "g"), ", ")}`
            : "";
        const amt = validCases.length - cancelled;
        if (amt === 0) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "All deletions were cancelled, no cases were deleted.");
            return;
        }
        pluginUtils_1.sendSuccessMessage(pluginData, message.channel, `${amt} case${amt === 1 ? " was" : "s were"} deleted!${failedAddendum}`);
    },
});
