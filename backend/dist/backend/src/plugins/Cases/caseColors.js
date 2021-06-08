"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseColors = void 0;
const CaseTypes_1 = require("../../data/CaseTypes");
exports.caseColors = {
    [CaseTypes_1.CaseTypes.Ban]: 0xcb4314,
    [CaseTypes_1.CaseTypes.Unban]: 0x9b59b6,
    [CaseTypes_1.CaseTypes.Note]: 0x3498db,
    [CaseTypes_1.CaseTypes.Warn]: 0xdae622,
    [CaseTypes_1.CaseTypes.Mute]: 0xe6b122,
    [CaseTypes_1.CaseTypes.Unmute]: 0xa175b3,
    [CaseTypes_1.CaseTypes.Kick]: 0xe67e22,
    [CaseTypes_1.CaseTypes.Deleted]: 0x000000,
    [CaseTypes_1.CaseTypes.Softban]: 0xe67e22,
};
