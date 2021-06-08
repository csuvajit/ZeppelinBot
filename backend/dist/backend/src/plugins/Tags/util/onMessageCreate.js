"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreate = void 0;
const utils_1 = require("../../../utils");
const validatorUtils_1 = require("../../../validatorUtils");
const LogType_1 = require("../../../data/LogType");
const matchAndRenderTagFromString_1 = require("./matchAndRenderTagFromString");
const messageIsEmpty_1 = require("../../../utils/messageIsEmpty");
async function onMessageCreate(pluginData, msg) {
    if (msg.is_bot)
        return;
    if (!msg.data.content)
        return;
    const member = await utils_1.resolveMember(pluginData.client, pluginData.guild, msg.user_id);
    if (!member)
        return;
    const channel = pluginData.guild.channels.get(msg.channel_id);
    if (!channel)
        return;
    const config = await pluginData.config.getMatchingConfig({
        member,
        channelId: msg.channel_id,
        categoryId: channel.parentID,
    });
    const tagResult = await matchAndRenderTagFromString_1.matchAndRenderTagFromString(pluginData, msg.data.content, member, {
        channelId: msg.channel_id,
        categoryId: channel.parentID,
    });
    if (!tagResult) {
        return;
    }
    // Check for cooldowns
    const cooldowns = [];
    if (tagResult.category) {
        // Category-specific cooldowns
        if (tagResult.category.user_tag_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(tagResult.category.user_tag_cooldown), "s");
            cooldowns.push([`tags-category-${tagResult.categoryName}-user-${msg.user_id}-tag-${tagResult.tagName}`, delay]);
        }
        if (tagResult.category.global_tag_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(tagResult.category.global_tag_cooldown), "s");
            cooldowns.push([`tags-category-${tagResult.categoryName}-tag-${tagResult.tagName}`, delay]);
        }
        if (tagResult.category.user_category_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(tagResult.category.user_category_cooldown), "s");
            cooldowns.push([`tags-category-${tagResult.categoryName}-user--${msg.user_id}`, delay]);
        }
        if (tagResult.category.global_category_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(tagResult.category.global_category_cooldown), "s");
            cooldowns.push([`tags-category-${tagResult.categoryName}`, delay]);
        }
    }
    else {
        // Dynamic tag cooldowns
        if (config.user_tag_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(config.user_tag_cooldown), "s");
            cooldowns.push([`tags-user-${msg.user_id}-tag-${tagResult.tagName}`, delay]);
        }
        if (config.global_tag_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(config.global_tag_cooldown), "s");
            cooldowns.push([`tags-tag-${tagResult.tagName}`, delay]);
        }
        if (config.user_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(config.user_cooldown), "s");
            cooldowns.push([`tags-user-${tagResult.tagName}`, delay]);
        }
        if (config.global_cooldown) {
            const delay = utils_1.convertDelayStringToMS(String(config.global_cooldown), "s");
            cooldowns.push([`tags`, delay]);
        }
    }
    const isOnCooldown = cooldowns.some(cd => pluginData.cooldowns.isOnCooldown(cd[0]));
    if (isOnCooldown)
        return;
    for (const cd of cooldowns) {
        pluginData.cooldowns.setCooldown(cd[0], cd[1]);
    }
    const validationError = await validatorUtils_1.validate(utils_1.tStrictMessageContent, tagResult.renderedContent);
    if (validationError) {
        pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
            body: `Rendering tag ${tagResult.tagName} resulted in an invalid message: ${validationError.message}`,
        });
        return;
    }
    if (messageIsEmpty_1.messageIsEmpty(tagResult.renderedContent)) {
        pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
            body: `Tag \`${tagResult.tagName}\` resulted in an empty message, so it couldn't be sent`,
        });
        return;
    }
    const allowMentions = tagResult.category?.allow_mentions ?? config.allow_mentions;
    const responseMsg = await channel.createMessage({
        ...tagResult.renderedContent,
        allowedMentions: { roles: allowMentions, users: allowMentions },
    });
    // Save the command-response message pair once the message is in our database
    const deleteWithCommand = tagResult.category?.delete_with_command ?? config.delete_with_command;
    if (deleteWithCommand) {
        pluginData.state.savedMessages.onceMessageAvailable(responseMsg.id, async () => {
            await pluginData.state.tags.addResponse(msg.id, responseMsg.id);
        });
    }
    const deleteInvoke = tagResult.category?.auto_delete_command ?? config.auto_delete_command;
    if (!deleteWithCommand && deleteInvoke) {
        // Try deleting the invoking message, ignore errors silently
        pluginData.client.deleteMessage(msg.channel_id, msg.id).catch(utils_1.noop);
    }
}
exports.onMessageCreate = onMessageCreate;
