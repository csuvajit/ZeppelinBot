"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditEmbedCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const formatContent_1 = require("../util/formatContent");
const parseColor_1 = require("../../../utils/parseColor");
const rgbToInt_1 = require("../../../utils/rgbToInt");
const COLOR_MATCH_REGEX = /^#?([0-9a-f]{6})$/;
exports.EditEmbedCmd = types_1.postCmd({
    trigger: "edit_embed",
    permission: "can_post",
    signature: {
        message: commandTypes_1.commandTypeHelpers.messageTarget(),
        maincontent: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
        title: commandTypes_1.commandTypeHelpers.string({ option: true }),
        content: commandTypes_1.commandTypeHelpers.string({ option: true }),
        color: commandTypes_1.commandTypeHelpers.string({ option: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const savedMessage = await pluginData.state.savedMessages.find(args.message.messageId);
        if (!savedMessage) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown message");
            return;
        }
        const content = args.content || args.maincontent;
        let color = null;
        if (args.color) {
            const colorRgb = parseColor_1.parseColor(args.color);
            if (colorRgb) {
                color = rgbToInt_1.rgbToInt(colorRgb);
            }
            else {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid color specified");
                return;
            }
        }
        const embed = savedMessage.data.embeds[0];
        if (args.title)
            embed.title = args.title;
        if (content)
            embed.description = formatContent_1.formatContent(content);
        if (color)
            embed.color = color;
        await pluginData.client.editMessage(savedMessage.channel_id, savedMessage.id, { embed });
        await pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Embed edited");
        if (args.content) {
            const prefix = pluginData.fullConfig.prefix || "!";
            msg.channel.createMessage(utils_1.trimLines(`
        <@!${msg.author.id}> You can now specify an embed's content directly at the end of the command:
        \`${prefix}edit_embed -title "Some title" content goes here\`
        The \`-content\` option will soon be removed in favor of this.
      `));
        }
    },
});
