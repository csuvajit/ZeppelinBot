"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const knub_1 = require("knub");
const { getMemberLevel } = knub_1.helpers;
exports.LevelCmd = types_1.utilityCmd({
    trigger: "level",
    description: "Show the permission level of a user",
    usage: "!level 106391128718245888",
    permission: "can_level",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember({ required: false }),
    },
    run({ message, args, pluginData }) {
        const member = args.member || message.member;
        const level = getMemberLevel(pluginData, member);
        message.channel.createMessage(`The permission level of ${member.username}#${member.discriminator} is **${level}**`);
    },
});
