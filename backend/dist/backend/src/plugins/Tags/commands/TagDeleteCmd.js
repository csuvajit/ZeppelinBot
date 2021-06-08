"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagDeleteCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
exports.TagDeleteCmd = types_1.tagsCmd({
    trigger: "tag delete",
    permission: "can_create",
    signature: {
        tag: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ message: msg, args, pluginData }) {
        const tag = await pluginData.state.tags.find(args.tag);
        if (!tag) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No tag with that name");
            return;
        }
        await pluginData.state.tags.delete(args.tag);
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Tag deleted!");
    },
});
