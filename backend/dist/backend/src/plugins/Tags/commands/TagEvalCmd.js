"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagEvalCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const templateFormatter_1 = require("../../../templateFormatter");
const pluginUtils_1 = require("../../../pluginUtils");
const renderTagBody_1 = require("../util/renderTagBody");
const utils_1 = require("../../../utils");
exports.TagEvalCmd = types_1.tagsCmd({
    trigger: "tag eval",
    permission: "can_create",
    signature: {
        body: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    },
    async run({ message: msg, args, pluginData }) {
        try {
            const rendered = await renderTagBody_1.renderTagBody(pluginData, args.body, [], {
                member: utils_1.stripObjectToScalars(msg.member, ["user"]),
                user: utils_1.stripObjectToScalars(msg.member.user),
            }, { member: msg.member });
            if (!rendered.content && !rendered.embed) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Evaluation resulted in an empty text");
                return;
            }
            msg.channel.createMessage(rendered);
        }
        catch (e) {
            if (e instanceof templateFormatter_1.TemplateParseError) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, `Failed to render tag: ${e.message}`);
                return;
            }
            throw e;
        }
    },
});
