"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagCreateCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const templateFormatter_1 = require("../../../templateFormatter");
const pluginUtils_1 = require("../../../pluginUtils");
exports.TagCreateCmd = types_1.tagsCmd({
    trigger: "tag",
    permission: "can_create",
    signature: {
        tag: commandTypes_1.commandTypeHelpers.string(),
        body: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        try {
            templateFormatter_1.parseTemplate(args.body);
        }
        catch (e) {
            if (e instanceof templateFormatter_1.TemplateParseError) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Invalid tag syntax: ${e.message}`);
                return;
            }
            else {
                throw e;
            }
        }
        await pluginData.state.tags.createOrUpdate(args.tag, args.body, msg.author.id);
        const prefix = pluginData.config.get().prefix;
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, `Tag set! Use it with: \`${prefix}${args.tag}\``);
    },
});
