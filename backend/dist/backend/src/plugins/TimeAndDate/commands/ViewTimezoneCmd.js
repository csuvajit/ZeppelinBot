"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewTimezoneCmd = void 0;
const types_1 = require("../types");
const getGuildTz_1 = require("../functions/getGuildTz");
exports.ViewTimezoneCmd = types_1.timeAndDateCmd({
    trigger: "timezone",
    permission: "can_set_timezone",
    signature: {},
    async run({ pluginData, message, args }) {
        const memberTimezone = await pluginData.state.memberTimezones.get(message.author.id);
        if (memberTimezone) {
            message.channel.createMessage(`Your timezone is currently set to **${memberTimezone.timezone}**`);
            return;
        }
        const serverTimezone = getGuildTz_1.getGuildTz(pluginData);
        message.channel.createMessage(`Your timezone is currently set to **${serverTimezone}** (server default)`);
    },
});
