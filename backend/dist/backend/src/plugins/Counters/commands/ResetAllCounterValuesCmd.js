"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetAllCounterValuesCmd = void 0;
const knub_1 = require("knub");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const resetAllCounterValues_1 = require("../functions/resetAllCounterValues");
const lockNameHelpers_1 = require("../../../utils/lockNameHelpers");
exports.ResetAllCounterValuesCmd = knub_1.typedGuildCommand()({
    trigger: ["counters reset_all"],
    permission: "can_reset_all",
    signature: {
        counterName: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ pluginData, message, args }) {
        const config = await pluginData.config.getForMessage(message);
        const counter = config.counters[args.counterName];
        const counterId = pluginData.state.counterIds[args.counterName];
        if (!counter || !counterId) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, `Unknown counter: ${args.counterName}`);
            return;
        }
        if (counter.can_reset_all === false) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, `Missing permissions to reset all of this counter's values`);
            return;
        }
        const counterName = counter.name || args.counterName;
        const confirmed = await utils_1.confirm(pluginData.client, message.channel, message.author.id, utils_1.trimMultilineString(`
        Do you want to reset **ALL** values for counter **${counterName}**?
        This will reset the counter for **all** users and channels.
        **Note:** This will *not* trigger any triggers or counter triggers.
      `));
        if (!confirmed) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Cancelled");
            return;
        }
        const loadingMessage = await message.channel
            .createMessage(`Resetting counter **${counterName}**. This might take a while. Please don't reload the config.`)
            .catch(() => null);
        const lock = await pluginData.locks.acquire(lockNameHelpers_1.counterIdLock(counterId), 10 * utils_1.MINUTES);
        await resetAllCounterValues_1.resetAllCounterValues(pluginData, args.counterName);
        lock.interrupt();
        loadingMessage?.delete().catch(utils_1.noop);
        pluginUtils_1.sendSuccessMessage(pluginData, message.channel, `All counter values for **${counterName}** have been reset`);
        pluginData.getKnubInstance().reloadGuild(pluginData.guild.id);
    },
});
