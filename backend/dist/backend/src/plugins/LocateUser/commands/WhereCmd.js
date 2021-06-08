"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const sendWhere_1 = require("../utils/sendWhere");
exports.WhereCmd = types_1.locateUserCmd({
    trigger: ["where", "w"],
    description: "Posts an instant invite to the voice channel that `<member>` is in",
    usage: "!w 108552944961454080",
    permission: "can_where",
    signature: {
        member: commandTypes_1.commandTypeHelpers.resolvedMember(),
    },
    async run({ message: msg, args, pluginData }) {
        sendWhere_1.sendWhere(pluginData, args.member, msg.channel, `${msg.member.mention} | `);
    },
});
