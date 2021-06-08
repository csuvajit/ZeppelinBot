"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledPostLoop = void 0;
const logger_1 = require("../../../logger");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const eris_1 = require("eris");
const postMessage_1 = require("./postMessage");
const SCHEDULED_POST_CHECK_INTERVAL = 5 * utils_1.SECONDS;
async function scheduledPostLoop(pluginData) {
    const duePosts = await pluginData.state.scheduledPosts.getDueScheduledPosts();
    for (const post of duePosts) {
        const channel = pluginData.guild.channels.get(post.channel_id);
        if (channel instanceof eris_1.TextChannel) {
            const [username, discriminator] = post.author_name.split("#");
            const author = pluginData.client.users.get(post.author_id) || {
                id: post.author_id,
                username,
                discriminator,
            };
            try {
                const postedMessage = await postMessage_1.postMessage(pluginData, channel, post.content, post.attachments, post.enable_mentions);
                pluginData.state.logs.log(LogType_1.LogType.POSTED_SCHEDULED_MESSAGE, {
                    author: utils_1.stripObjectToScalars(author),
                    channel: utils_1.stripObjectToScalars(channel),
                    messageId: postedMessage.id,
                });
            }
            catch {
                pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Failed to post scheduled message by {userMention(author)} to {channelMention(channel)}`,
                    channel: utils_1.stripObjectToScalars(channel),
                    author: utils_1.stripObjectToScalars(author),
                });
                logger_1.logger.warn(`Failed to post scheduled message to #${channel.name} (${channel.id}) on ${pluginData.guild.name} (${pluginData.guild.id})`);
            }
        }
        let shouldClear = true;
        if (post.repeat_interval) {
            const nextPostAt = moment_timezone_1.default.utc().add(post.repeat_interval, "ms");
            if (post.repeat_until) {
                const repeatUntil = moment_timezone_1.default.utc(post.repeat_until, utils_1.DBDateFormat);
                if (nextPostAt.isSameOrBefore(repeatUntil)) {
                    await pluginData.state.scheduledPosts.update(post.id, {
                        post_at: nextPostAt.format(utils_1.DBDateFormat),
                    });
                    shouldClear = false;
                }
            }
            else if (post.repeat_times) {
                if (post.repeat_times > 1) {
                    await pluginData.state.scheduledPosts.update(post.id, {
                        post_at: nextPostAt.format(utils_1.DBDateFormat),
                        repeat_times: post.repeat_times - 1,
                    });
                    shouldClear = false;
                }
            }
        }
        if (shouldClear) {
            await pluginData.state.scheduledPosts.delete(post.id);
        }
    }
    pluginData.state.scheduledPostLoopTimeout = setTimeout(() => scheduledPostLoop(pluginData), SCHEDULED_POST_CHECK_INTERVAL);
}
exports.scheduledPostLoop = scheduledPostLoop;
