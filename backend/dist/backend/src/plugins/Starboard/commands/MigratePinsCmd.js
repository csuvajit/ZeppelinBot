"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigratePinsCmd = void 0;
const commandTypes_1 = require("../../../commandTypes");
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const eris_1 = require("eris");
const saveMessageToStarboard_1 = require("../util/saveMessageToStarboard");
exports.MigratePinsCmd = types_1.starboardCmd({
    trigger: "starboard migrate_pins",
    permission: "can_migrate",
    description: "Posts all pins from a channel to the specified starboard. The pins are NOT unpinned automatically.",
    signature: {
        pinChannel: commandTypes_1.commandTypeHelpers.textChannel(),
        starboardName: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ message: msg, args, pluginData }) {
        const config = await pluginData.config.get();
        const starboard = config.boards[args.starboardName];
        if (!starboard) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown starboard specified");
            return;
        }
        const starboardChannel = pluginData.guild.channels.get(starboard.channel_id);
        if (!starboardChannel || !(starboardChannel instanceof eris_1.TextChannel)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Starboard has an unknown/invalid channel id");
            return;
        }
        msg.channel.createMessage(`Migrating pins from <#${args.pinChannel.id}> to <#${starboardChannel.id}>...`);
        const pins = await args.pinChannel.getPins();
        pins.reverse(); // Migrate pins starting from the oldest message
        for (const pin of pins) {
            const existingStarboardMessage = await pluginData.state.starboardMessages.getMatchingStarboardMessages(starboardChannel.id, pin.id);
            if (existingStarboardMessage.length > 0)
                continue;
            await saveMessageToStarboard_1.saveMessageToStarboard(pluginData, pin, starboard);
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Pins migrated from <#${args.pinChannel.id}> to <#${starboardChannel.id}>!`);
    },
});
