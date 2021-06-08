"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnowflakeInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const getSnowflakeInfoEmbed_1 = require("../functions/getSnowflakeInfoEmbed");
exports.SnowflakeInfoCmd = types_1.utilityCmd({
    trigger: ["snowflake", "snowflakeinfo"],
    description: "Show information about a snowflake ID",
    usage: "!snowflake 534722016549404673",
    permission: "can_snowflake",
    signature: {
        id: commandTypes_1.commandTypeHelpers.anyId(),
    },
    async run({ message, args, pluginData }) {
        const embed = await getSnowflakeInfoEmbed_1.getSnowflakeInfoEmbed(pluginData, args.id, false, message.author.id);
        message.channel.createMessage({ embed });
    },
});
