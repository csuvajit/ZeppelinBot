"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEmbedCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const actualPostCmd_1 = require("../util/actualPostCmd");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const formatContent_1 = require("../util/formatContent");
const parseColor_1 = require("../../../utils/parseColor");
const rgbToInt_1 = require("../../../utils/rgbToInt");
exports.PostEmbedCmd = types_1.postCmd({
    trigger: "post_embed",
    permission: "can_post",
    signature: {
        channel: commandTypes_1.commandTypeHelpers.textChannel(),
        maincontent: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
        title: commandTypes_1.commandTypeHelpers.string({ option: true }),
        content: commandTypes_1.commandTypeHelpers.string({ option: true }),
        color: commandTypes_1.commandTypeHelpers.string({ option: true }),
        raw: commandTypes_1.commandTypeHelpers.bool({ option: true, isSwitch: true, shortcut: "r" }),
        schedule: commandTypes_1.commandTypeHelpers.string({ option: true }),
        repeat: commandTypes_1.commandTypeHelpers.delay({ option: true }),
        "repeat-until": commandTypes_1.commandTypeHelpers.string({ option: true }),
        "repeat-times": commandTypes_1.commandTypeHelpers.number({ option: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const content = args.content || args.maincontent;
        if (!args.title && !content) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Title or content required");
            return;
        }
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
        let embed = { type: "rich" };
        if (args.title)
            embed.title = args.title;
        if (color)
            embed.color = color;
        if (content) {
            if (args.raw) {
                let parsed;
                try {
                    parsed = JSON.parse(content);
                }
                catch (e) {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Syntax error in embed JSON: ${e.message}`);
                    return;
                }
                if (!utils_1.isValidEmbed(parsed)) {
                    pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Embed is not valid");
                    return;
                }
                embed = Object.assign({}, embed, parsed);
            }
            else {
                embed.description = formatContent_1.formatContent(content);
            }
        }
        if (args.content) {
            const prefix = pluginData.fullConfig.prefix || "!";
            msg.channel.createMessage(utils_1.trimLines(`
        <@!${msg.author.id}> You can now specify an embed's content directly at the end of the command:
        \`${prefix}edit_embed -title "Some title" content goes here\`
        The \`-content\` option will soon be removed in favor of this.
      `));
        }
        actualPostCmd_1.actualPostCmd(pluginData, msg, args.channel, { embed }, args);
    },
});
