"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const pluginUtils_1 = require("../../../pluginUtils");
exports.AvatarCmd = types_1.utilityCmd({
    trigger: ["avatar", "av"],
    description: "Retrieves a user's profile picture",
    permission: "can_avatar",
    signature: {
        user: commandTypes_1.commandTypeHelpers.resolvedUserLoose({ required: false }),
    },
    async run({ message: msg, args, pluginData }) {
        const user = args.user || msg.author;
        if (!(user instanceof utils_1.UnknownUser)) {
            let extension = user.avatarURL.slice(user.avatarURL.lastIndexOf("."), user.avatarURL.lastIndexOf("?"));
            // Some pngs can have the .jpg extention for some reason, so we always use .png for static images
            extension = extension === ".gif" ? extension : ".png";
            const avatarUrl = user.avatarURL.slice(0, user.avatarURL.lastIndexOf("."));
            const embed = {
                image: { url: avatarUrl + `${extension}?size=2048` },
            };
            embed.title = `Avatar of ${user.username}#${user.discriminator}:`;
            msg.channel.createMessage({ embed });
        }
        else {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Invalid user ID");
        }
    },
});
