"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveMessagesToDBCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const saveMessagesToDB_1 = require("../saveMessagesToDB");
const pluginUtils_1 = require("../../../pluginUtils");
exports.SaveMessagesToDBCmd = types_1.messageSaverCmd({
    trigger: "save_messages_to_db",
    permission: "can_manage",
    source: "guild",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel(),
        ids: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        await msg.channel.createMessage("Saving specified messages...");
        const { savedCount, failed } = await saveMessagesToDB_1.saveMessagesToDB(pluginData, args.channel, args.ids.trim().split(" "));
        if (failed.length) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Saved ${savedCount} messages. The following messages could not be saved: ${failed.join(", ")}`);
        }
        else {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Saved ${savedCount} messages!`);
        }
    },
});
