"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchMultipleTextTypesOnMessage = void 0;
const utils_1 = require("../../../utils");
/**
 * Generator function that allows iterating through matchable pieces of text of a SavedMessage
 */
async function* matchMultipleTextTypesOnMessage(pluginData, trigger, msg) {
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, msg.user_id);
    if (!member)
        return;
    if (trigger.match_messages && msg.data.content) {
        yield ["message", msg.data.content];
    }
    if (trigger.match_embeds && msg.data.embeds && msg.data.embeds.length) {
        const copiedEmbed = JSON.parse(JSON.stringify(msg.data.embeds[0]));
        if (copiedEmbed.type === "video") {
            copiedEmbed.description = ""; // The description is not rendered, hence it doesn't need to be matched
        }
        yield ["embed", JSON.stringify(copiedEmbed)];
    }
    if (trigger.match_visible_names) {
        yield ["visiblename", member.nick || msg.data.author.username];
    }
    if (trigger.match_usernames) {
        yield ["username", `${msg.data.author.username}#${msg.data.author.discriminator}`];
    }
    if (trigger.match_nicknames && member.nick) {
        yield ["nickname", member.nick];
    }
    // type 4 = custom status
    if (trigger.match_custom_status && member.game?.type === 4 && member.game?.state) {
        yield ["customstatus", member.game.state];
    }
}
exports.matchMultipleTextTypesOnMessage = matchMultipleTextTypesOnMessage;
