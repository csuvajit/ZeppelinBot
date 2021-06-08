"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberTz = void 0;
const getGuildTz_1 = require("./getGuildTz");
async function getMemberTz(pluginData, memberId) {
    const memberTz = await pluginData.state.memberTimezones.get(memberId);
    return memberTz?.timezone || getGuildTz_1.getGuildTz(pluginData);
}
exports.getMemberTz = getMemberTz;
