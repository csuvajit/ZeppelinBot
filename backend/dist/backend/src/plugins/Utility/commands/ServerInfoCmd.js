"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const getServerInfoEmbed_1 = require("../functions/getServerInfoEmbed");
exports.ServerInfoCmd = types_1.utilityCmd({
    trigger: ["server", "serverinfo"],
    description: "Show server information",
    usage: "!server",
    permission: "can_server",
    signature: {
        serverId: commandTypes_1.commandTypeHelpers.string({ required: false }),
    },
    async run({ message, pluginData, args }) {
        const serverId = args.serverId || pluginData.guild.id;
        const serverInfoEmbed = await getServerInfoEmbed_1.getServerInfoEmbed(pluginData, serverId, message.author.id);
        if (!serverInfoEmbed) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Could not find information for that server");
            return;
        }
        message.channel.createMessage({ embed: serverInfoEmbed });
    },
});
