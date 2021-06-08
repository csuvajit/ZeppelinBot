"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledPostsListCmd = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
const SCHEDULED_POST_PREVIEW_TEXT_LENGTH = 50;
exports.ScheduledPostsListCmd = types_1.postCmd({
    trigger: ["scheduled_posts", "scheduled_posts list"],
    permission: "can_post",
    async run({ message: msg, pluginData }) {
        const scheduledPosts = await pluginData.state.scheduledPosts.all();
        if (scheduledPosts.length === 0) {
            msg.channel.createMessage("No scheduled posts");
            return;
        }
        scheduledPosts.sort(utils_1.sorter("post_at"));
        let i = 1;
        const postLines = scheduledPosts.map(p => {
            let previewText = p.content.content || (p.content.embed && (p.content.embed.description || p.content.embed.title)) || "";
            const isTruncated = previewText.length > SCHEDULED_POST_PREVIEW_TEXT_LENGTH;
            previewText = utils_1.disableCodeBlocks(utils_1.deactivateMentions(previewText))
                .replace(/\s+/g, " ")
                .slice(0, SCHEDULED_POST_PREVIEW_TEXT_LENGTH);
            const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
            const prettyPostAt = timeAndDate
                .inGuildTz(moment_timezone_1.default.utc(p.post_at, utils_1.DBDateFormat))
                .format(timeAndDate.getDateFormat("pretty_datetime"));
            const parts = [`\`#${i++}\` \`[${prettyPostAt}]\` ${previewText}${isTruncated ? "..." : ""}`];
            if (p.attachments.length)
                parts.push("*(with attachment)*");
            if (p.content.embed)
                parts.push("*(embed)*");
            if (p.repeat_until) {
                parts.push(`*(repeated every ${humanize_duration_1.default(p.repeat_interval)} until ${p.repeat_until})*`);
            }
            if (p.repeat_times) {
                parts.push(`*(repeated every ${humanize_duration_1.default(p.repeat_interval)}, ${p.repeat_times} more ${p.repeat_times === 1 ? "time" : "times"})*`);
            }
            parts.push(`*(${p.author_name})*`);
            return parts.join(" ");
        });
        const finalMessage = utils_1.trimLines(`
      ${postLines.join("\n")}
      
      Use \`scheduled_posts <num>\` to view a scheduled post in full
      Use \`scheduled_posts delete <num>\` to delete a scheduled post
    `);
        utils_1.createChunkedMessage(msg.channel, finalMessage);
    },
});
