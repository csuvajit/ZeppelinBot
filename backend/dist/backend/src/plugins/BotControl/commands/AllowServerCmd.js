"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowServerCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const apiPermissions_1 = require("@shared/apiPermissions");
exports.AllowServerCmd = types_1.botControlCmd({
    trigger: ["allow_server", "allowserver", "add_server", "addserver"],
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    signature: {
        guildId: commandTypes_1.commandTypeHelpers.string(),
        userId: commandTypes_1.commandTypeHelpers.string({ required: false }),
    },
    async run({ pluginData, message: msg, args }) {
        const existing = await pluginData.state.allowedGuilds.find(args.guildId);
        if (existing) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Server is already allowed!");
            return;
        }
        if (!utils_1.isSnowflake(args.guildId)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid server ID!");
            return;
        }
        if (args.userId && !utils_1.isSnowflake(args.userId)) {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid user ID!");
            return;
        }
        await pluginData.state.allowedGuilds.add(args.guildId);
        await pluginData.state.configs.saveNewRevision(`guild-${args.guildId}`, "plugins: {}", msg.author.id);
        if (args.userId) {
            await pluginData.state.apiPermissionAssignments.addUser(args.guildId, args.userId, [apiPermissions_1.ApiPermissions.EditConfig]);
        }
        pluginUtils_1.sendSuccessMessage(pluginData, msg.channel, "Server is now allowed to use Zeppelin!");
    },
});
