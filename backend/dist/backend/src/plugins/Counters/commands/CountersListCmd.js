"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountersListCmd = void 0;
const knub_1 = require("knub");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const getGuildPrefix_1 = require("../../../utils/getGuildPrefix");
exports.CountersListCmd = knub_1.typedGuildCommand()({
    trigger: ["counters list", "counter list", "counters"],
    permission: "can_view",
    signature: {},
    async run({ pluginData, message, args }) {
        const config = await pluginData.config.getForMessage(message);
        const countersToShow = Array.from(Object.values(config.counters)).filter(c => c.can_view !== false);
        if (!countersToShow.length) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "No counters are configured for this server");
            return;
        }
        const counterLines = countersToShow.map(counter => {
            const title = counter.pretty_name ? `**${counter.pretty_name}** (\`${counter.name}\`)` : `\`${counter.name}\``;
            const types = [];
            if (counter.per_user)
                types.push("per user");
            if (counter.per_channel)
                types.push("per channel");
            const typeInfo = types.length ? types.join(", ") : "global";
            const decayInfo = counter.decay ? `decays ${counter.decay.amount} every ${counter.decay.every}` : null;
            const info = [typeInfo, decayInfo].filter(Boolean);
            return `${title}\n${utils_1.ucfirst(info.join("; "))}`;
        });
        const hintLines = [`Use \`${getGuildPrefix_1.getGuildPrefix(pluginData)}counters view <name>\` to view a counter's value`];
        if (config.can_edit) {
            hintLines.push(`Use \`${getGuildPrefix_1.getGuildPrefix(pluginData)}counters set <name> <value>\` to change a counter's value`);
        }
        if (config.can_reset_all) {
            hintLines.push(`Use \`${getGuildPrefix_1.getGuildPrefix(pluginData)}counters reset_all <name>\` to reset a counter entirely`);
        }
        message.channel.createMessage(utils_1.trimMultilineString(`
      ${counterLines.join("\n\n")}
      
      ${hintLines.join("\n")}
    `));
    },
});
