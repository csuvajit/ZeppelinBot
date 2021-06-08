"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const getRoleInfoEmbed_1 = require("../functions/getRoleInfoEmbed");
exports.RoleInfoCmd = types_1.utilityCmd({
    trigger: ["roleinfo"],
    description: "Show information about a role",
    usage: "!role 106391128718245888",
    permission: "can_roleinfo",
    signature: {
        role: commandTypes_1.commandTypeHelpers.role({ required: true }),
    },
    async run({ message, args, pluginData }) {
        const embed = await getRoleInfoEmbed_1.getRoleInfoEmbed(pluginData, args.role, message.author.id);
        message.channel.createMessage({ embed });
    },
});
