"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesUserCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const CasesPlugin_1 = require("../../../plugins/Cases/CasesPlugin");
const utils_1 = require("../../../utils");
const getGuildPrefix_1 = require("../../../utils/getGuildPrefix");
const eris_1 = require("eris");
const getChunkedEmbedFields_1 = require("../../../utils/getChunkedEmbedFields");
const async_1 = require("../../../utils/async");
const CaseTypes_1 = require("../../../data/CaseTypes");
const opts = {
    expand: commandTypes_1.commandTypeHelpers.bool({ option: true, isSwitch: true, shortcut: "e" }),
    hidden: commandTypes_1.commandTypeHelpers.bool({ option: true, isSwitch: true, shortcut: "h" }),
    reverseFilters: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "r" }),
    notes: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "n" }),
    warns: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "w" }),
    mutes: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "m" }),
    unmutes: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "um" }),
    bans: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "b" }),
    unbans: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "ub" }),
};
exports.CasesUserCmd = types_1.modActionsCmd({
    trigger: ["cases", "modlogs"],
    permission: "can_view",
    description: "Show a list of cases the specified user has",
    signature: [
        {
            user: commandTypes_1.commandTypeHelpers.string(),
            ...opts,
        },
    ],
    async run({ pluginData, message: msg, args }) {
        const user = await utils_1.resolveUser(pluginData.client, args.user);
        if (!user.id) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `User not found`);
            return;
        }
        let cases = await pluginData.state.cases.with("notes").getByUserId(user.id);
        const typesToShow = [];
        if (args.notes)
            typesToShow.push(CaseTypes_1.CaseTypes.Note);
        if (args.warns)
            typesToShow.push(CaseTypes_1.CaseTypes.Warn);
        if (args.mutes)
            typesToShow.push(CaseTypes_1.CaseTypes.Mute);
        if (args.unmutes)
            typesToShow.push(CaseTypes_1.CaseTypes.Unmute);
        if (args.bans)
            typesToShow.push(CaseTypes_1.CaseTypes.Ban);
        if (args.unbans)
            typesToShow.push(CaseTypes_1.CaseTypes.Unban);
        if (typesToShow.length > 0) {
            // Reversed: Hide specified types
            if (args.reverseFilters)
                cases = cases.filter(c => !typesToShow.includes(c.type));
            // Normal: Show only specified types
            else
                cases = cases.filter(c => typesToShow.includes(c.type));
        }
        const normalCases = cases.filter(c => !c.is_hidden);
        const hiddenCases = cases.filter(c => c.is_hidden);
        const userName = user instanceof utils_1.UnknownUser && cases.length
            ? cases[cases.length - 1].user_name
            : `${user.username}#${user.discriminator}`;
        if (cases.length === 0) {
            msg.channel.createMessage(`No cases found for **${userName}**`);
        }
        else {
            const casesToDisplay = args.hidden ? cases : normalCases;
            if (args.expand) {
                if (casesToDisplay.length > 8) {
                    msg.channel.createMessage("Too many cases for expanded view. Please use compact view instead.");
                    return;
                }
                // Expanded view (= individual case embeds)
                const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
                for (const theCase of casesToDisplay) {
                    const embed = await casesPlugin.getCaseEmbed(theCase.id);
                    msg.channel.createMessage(embed);
                }
            }
            else {
                // Compact view (= regular message with a preview of each case)
                const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
                const lines = await async_1.asyncMap(casesToDisplay, c => casesPlugin.getCaseSummary(c, true, msg.author.id));
                const prefix = getGuildPrefix_1.getGuildPrefix(pluginData);
                const linesPerChunk = 10;
                const lineChunks = utils_1.chunkArray(lines, linesPerChunk);
                const footerField = {
                    name: utils_1.emptyEmbedValue,
                    value: utils_1.trimLines(`
            Use \`${prefix}case <num>\` to see more information about an individual case
          `),
                };
                for (const [i, linesInChunk] of lineChunks.entries()) {
                    const isLastChunk = i === lineChunks.length - 1;
                    if (isLastChunk && !args.hidden && hiddenCases.length) {
                        if (hiddenCases.length === 1) {
                            linesInChunk.push(`*+${hiddenCases.length} hidden case, use "-hidden" to show it*`);
                        }
                        else {
                            linesInChunk.push(`*+${hiddenCases.length} hidden cases, use "-hidden" to show them*`);
                        }
                    }
                    const chunkStart = i * linesPerChunk + 1;
                    const chunkEnd = Math.min((i + 1) * linesPerChunk, lines.length);
                    const embed = {
                        author: {
                            name: lineChunks.length === 1
                                ? `Cases for ${userName} (${lines.length} total)`
                                : `Cases ${chunkStart}–${chunkEnd} of ${lines.length} for ${userName}`,
                            icon_url: user instanceof eris_1.User ? user.avatarURL || user.defaultAvatarURL : undefined,
                        },
                        fields: [
                            ...getChunkedEmbedFields_1.getChunkedEmbedFields(utils_1.emptyEmbedValue, linesInChunk.join("\n")),
                            ...(isLastChunk ? [footerField] : []),
                        ],
                    };
                    msg.channel.createMessage({ embed });
                }
            }
        }
    },
});
