"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagSourceCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.TagSourceCmd = types_1.tagsCmd({
    trigger: "tag",
    permission: "can_create",
    signature: {
        tag: commandTypes_1.commandTypeHelpers.string(),
        delete: commandTypes_1.commandTypeHelpers.bool({ option: true, shortcut: "d", isSwitch: true }),
    },
    async run({ message: msg, args, pluginData }) {
        if (args.delete) {
            const actualTag = await pluginData.state.tags.find(args.tag);
            if (!actualTag) {
                pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No tag with that name");
                return;
            }
            await pluginData.state.tags.delete(args.tag);
            pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Tag deleted!");
            return;
        }
        const tag = await pluginData.state.tags.find(args.tag);
        if (!tag) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "No tag with that name");
            return;
        }
        const archiveId = await pluginData.state.archives.create(tag.body, moment_timezone_1.default.utc().add(10, "minutes"));
        const url = pluginData.state.archives.getUrl(pluginUtils_1.getBaseUrl(pluginData), archiveId);
        msg.channel.createMessage(`Tag source:\n${url}`);
    },
});
