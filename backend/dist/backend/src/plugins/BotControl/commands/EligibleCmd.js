"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibleCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const REQUIRED_MEMBER_COUNT = 5000;
exports.EligibleCmd = types_1.botControlCmd({
    trigger: ["eligible", "is_eligible", "iseligible"],
    permission: "can_eligible",
    signature: {
        user: commandTypes_1.commandTypeHelpers.resolvedUser(),
        inviteCode: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ pluginData, message: msg, args }) {
        if ((await pluginData.state.apiPermissionAssignments.getByUserId(args.user.id)).length) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `${utils_1.verboseUserMention(args.user)} is an existing bot operator. They are eligible!`);
            return;
        }
        const invite = await utils_1.resolveInvite(pluginData.client, args.inviteCode, true);
        if (!invite || !invite.guild) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Could not resolve server from invite");
            return;
        }
        if (invite.guild.features.includes("PARTNERED")) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Server is partnered. It is eligible!`);
            return;
        }
        if (invite.guild.features.includes("VERIFIED")) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Server is verified. It is eligible!`);
            return;
        }
        const memberCount = invite.memberCount || 0;
        if (memberCount >= REQUIRED_MEMBER_COUNT) {
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Server has ${memberCount} members, which is equal or higher than the required ${REQUIRED_MEMBER_COUNT}. It is eligible!`);
            return;
        }
        pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Server **${invite.guild.name}** (\`${invite.guild.id}\`) is not eligible`);
    },
});
