"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavePinsToDBCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const saveMessagesToDB_1 = require("../saveMessagesToDB");
const pluginUtils_1 = require("../../../pluginUtils");
exports.SavePinsToDBCmd = types_1.messageSaverCmd({
    trigger: "save_pins_to_db",
    permission: "can_manage",
    source: "guild",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel(),
    },
    async run({ message: msg, args, pluginData }) {
        await msg.channel.createMessage(`Saving pins from <#${args.channel.id}>...`);
        const pins = await args.channel.getPins();
        const { savedCount, failed } = await saveMessagesToDB_1.saveMessagesToDB(pluginData, args.channel, pins.map(m => m.id));
        if (failed.length) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Saved ${savedCount} messages. The following messages could not be saved: ${failed.join(", ")}`);
        }
        else {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Saved ${savedCount} messages!`);
        }
    },
});
