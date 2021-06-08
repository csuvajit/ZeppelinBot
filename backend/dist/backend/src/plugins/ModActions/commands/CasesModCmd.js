"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesModCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
const async_1 = require("../../../utils/async");
const eris_1 = require("eris");
const getChunkedEmbedFields_1 = require("../../../utils/getChunkedEmbedFields");
const getGuildPrefix_1 = require("../../../utils/getGuildPrefix");
const createPaginatedMessage_1 = require("../../../utils/createPaginatedMessage");
const opts = {
    mod: commandTypes_1.commandTypeHelpers.userId({ option: true }),
};
const casesPerPage = 5;
exports.CasesModCmd = types_1.modActionsCmd({
    trigger: ["cases", "modlogs", "infractions"],
    permission: "can_view",
    description: "Show the most recent 5 cases by the specified -mod",
    signature: [
        {
            ...opts,
        },
    ],
    async run({ pluginData, message: msg, args }) {
        const modId = args.mod || msg.author.id;
        const mod = await utils_1.resolveUser(pluginData.client, modId);
        const modName = mod instanceof eris_1.User ? `${mod.username}#${mod.discriminator}` : modId;
        const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
        const totalCases = await casesPlugin.getTotalCasesByMod(modId);
        if (totalCases === 0) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `No cases by **${modName}**`);
            return;
        }
        const totalPages = Math.max(Math.ceil(totalCases / casesPerPage), 1);
        const prefix = getGuildPrefix_1.getGuildPrefix(pluginData);
        createPaginatedMessage_1.createPaginatedMessage(pluginData.client, msg.channel, totalPages, async (page) => {
            const cases = await casesPlugin.getRecentCasesByMod(modId, casesPerPage, (page - 1) * casesPerPage);
            const lines = await async_1.asyncMap(cases, c => casesPlugin.getCaseSummary(c, true, msg.author.id));
            const firstCaseNum = (page - 1) * casesPerPage + 1;
            const lastCaseNum = page * casesPerPage;
            const title = `Most recent cases ${firstCaseNum}-${lastCaseNum} of ${totalCases} by ${modName}`;
            const embed = {
                author: {
                    name: title,
                    icon_url: mod instanceof eris_1.User ? mod.avatarURL || mod.defaultAvatarURL : undefined,
                },
                fields: [
                    ...getChunkedEmbedFields_1.getChunkedEmbedFields(utils_1.emptyEmbedValue, lines.join("\n")),
                    {
                        name: utils_1.emptyEmbedValue,
                        value: utils_1.trimLines(`
                Use \`${prefix}case <num>\` to see more information about an individual case
                Use \`${prefix}cases <user>\` to see a specific user's cases
              `),
                    },
                ],
            };
            return { embed };
        }, {
            limitToUserId: msg.author.id,
        });
    },
});
