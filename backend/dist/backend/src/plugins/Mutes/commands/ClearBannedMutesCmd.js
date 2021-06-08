"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearBannedMutesCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
exports.ClearBannedMutesCmd = types_1.mutesCmd({
    trigger: "clear_banned_mutes",
    permission: "can_cleanup",
    description: "Clear dangling mutes for members who have been banned",
    async run({ pluginData, message: msg }) {
        await msg.channel.createMessage("Clearing mutes from banned users...");
        const activeMutes = await pluginData.state.mutes.getActiveMutes();
        // Mismatch in Eris docs and actual result here, based on Eris's code comments anyway
        const bans = (await pluginData.guild.getBans());
        const bannedIds = bans.map(b => b.user.id);
        await msg.channel.createMessage(`Found ${activeMutes.length} mutes and ${bannedIds.length} bans, cross-referencing...`);
        let cleared = 0;
        for (const mute of activeMutes) {
            if (bannedIds.includes(mute.user_id)) {
                await pluginData.state.mutes.clear(mute.user_id);
                cleared++;
            }
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Cleared ${cleared} mutes from banned users!`);
    },
});
