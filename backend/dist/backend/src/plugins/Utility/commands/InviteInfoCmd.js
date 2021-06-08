"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteInfoCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const getInviteInfoEmbed_1 = require("../functions/getInviteInfoEmbed");
const utils_1 = require("../../../utils");
exports.InviteInfoCmd = types_1.utilityCmd({
    trigger: ["invite", "inviteinfo"],
    description: "Show information about an invite",
    usage: "!invite overwatch",
    permission: "can_inviteinfo",
    signature: {
        inviteCode: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ message, args, pluginData }) {
        const inviteCode = utils_1.parseInviteCodeInput(args.inviteCode);
        const embed = await getInviteInfoEmbed_1.getInviteInfoEmbed(pluginData, inviteCode);
        if (!embed) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, "Unknown invite");
            return;
        }
        message.channel.createMessage({ embed });
    },
});
