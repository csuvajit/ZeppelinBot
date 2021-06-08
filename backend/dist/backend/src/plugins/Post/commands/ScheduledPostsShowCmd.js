"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledPostsShowCmd = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const postMessage_1 = require("../util/postMessage");
exports.ScheduledPostsShowCmd = types_1.postCmd({
    trigger: ["scheduled_posts", "scheduled_posts show"],
    permission: "can_post",
    signature: {
        num: commandTypes_1.commandTypeHelpers.number(),
    },
    async run({ message: msg, args, pluginData }) {
        const scheduledPosts = await pluginData.state.scheduledPosts.all();
        scheduledPosts.sort(utils_1.sorter("post_at"));
        const post = scheduledPosts[args.num - 1];
        if (!post) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Scheduled post not found");
            return;
        }
        postMessage_1.postMessage(pluginData, msg.channel, post.content, post.attachments, post.enable_mentions);
    },
});
