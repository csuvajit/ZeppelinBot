"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
exports.HelpCmd = types_1.utilityCmd({
    trigger: "help",
    description: "Show a quick reference for the specified command's usage",
    usage: "!help clean",
    permission: "can_help",
    signature: {
        command: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const searchStr = args.command.toLowerCase();
        const matchingCommands = [];
        const guildData = pluginData.getKnubInstance().getLoadedGuild(pluginData.guild.id);
        for (const plugin of guildData.loadedPlugins.values()) {
            const registeredCommands = plugin.pluginData.commands.getAll();
            for (const registeredCommand of registeredCommands) {
                for (const trigger of registeredCommand.originalTriggers) {
                    const strTrigger = typeof trigger === "string" ? trigger : trigger.source;
                    if (strTrigger.startsWith(searchStr)) {
                        matchingCommands.push({
                            plugin,
                            command: registeredCommand,
                        });
                    }
                }
            }
        }
        const totalResults = matchingCommands.length;
        const limitedResults = matchingCommands.slice(0, 3);
        const commandSnippets = limitedResults.map(({ plugin, command }) => {
            const prefix = command.originalPrefix
                ? typeof command.originalPrefix === "string"
                    ? command.originalPrefix
                    : command.originalPrefix.source
                : "";
            const originalTrigger = command.originalTriggers[0];
            const trigger = originalTrigger
                ? typeof originalTrigger === "string"
                    ? originalTrigger
                    : originalTrigger.source
                : "";
            const description = command.config.extra.blueprint.description;
            const usage = command.config.extra.blueprint.usage;
            const commandSlug = trigger
                .trim()
                .toLowerCase()
                .replace(/\s/g, "-");
            let snippet = `**${prefix}${trigger}**`;
            if (description)
                snippet += `\n${description}`;
            if (usage)
                snippet += `\nBasic usage: \`${usage}\``;
            snippet += `\n<https://zeppelin.gg/docs/plugins/${plugin.blueprint.name}/usage#command-${commandSlug}>`;
            return snippet;
        });
        if (totalResults === 0) {
            msg.channel.createMessage("No matching commands found!");
            return;
        }
        let message = totalResults !== limitedResults.length
            ? `Results (${totalResults} total, showing first ${limitedResults.length}):\n\n`
            : "";
        message += `${commandSnippets.join("\n\n")}`;
        utils_1.createChunkedMessage(msg.channel, message);
    },
});
