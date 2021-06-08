"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagListCmd = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
exports.TagListCmd = types_1.tagsCmd({
    trigger: ["tag list", "tags", "taglist"],
    permission: "can_list",
    async run({ message: msg, pluginData }) {
        const tags = await pluginData.state.tags.all();
        if (tags.length === 0) {
            msg.channel.createMessage(`No tags created yet! Use \`tag create\` command to create one.`);
            return;
        }
        const prefix = (await pluginData.config.getForMessage(msg)).prefix;
        const tagNames = tags.map(tag => tag.tag).sort();
        utils_1.createChunkedMessage(msg.channel, `Available tags (use with ${prefix}tag): \`\`\`${tagNames.join(", ")}\`\`\``);
    },
});
