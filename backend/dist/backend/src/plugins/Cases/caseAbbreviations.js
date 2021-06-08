"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseAbbreviations = void 0;
const CaseTypes_1 = require("../../data/CaseTypes");
exports.caseAbbreviations = {
    [CaseTypes_1.CaseTypes.Ban]: "BAN",
    [CaseTypes_1.CaseTypes.Unban]: "UNBN",
    [CaseTypes_1.CaseTypes.Note]: "NOTE",
    [CaseTypes_1.CaseTypes.Warn]: "WARN",
    [CaseTypes_1.CaseTypes.Kick]: "KICK",
    [CaseTypes_1.CaseTypes.Mute]: "MUTE",
    [CaseTypes_1.CaseTypes.Unmute]: "UNMT",
    [CaseTypes_1.CaseTypes.Deleted]: "DEL",
    [CaseTypes_1.CaseTypes.Softban]: "SFTB",
};
