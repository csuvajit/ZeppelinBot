"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetTimezoneCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const getGuildTz_1 = require("../functions/getGuildTz");
exports.ResetTimezoneCmd = types_1.timeAndDateCmd({
    trigger: "timezone reset",
    permission: "can_set_timezone",
    signature: {},
    async run({ pluginData, message }) {
        await pluginData.state.memberTimezones.reset(message.author.id);
        const serverTimezone = getGuildTz_1.getGuildTz(pluginData);
        pluginUtils_1.sendSuccessMessage(pluginData, message.channel, `Your timezone has been reset to server default, **${serverTimezone}**`);
    },
});
