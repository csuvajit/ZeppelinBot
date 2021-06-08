"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseTypeToName = exports.CaseNameToType = exports.CaseTypes = void 0;
var CaseTypes;
(function (CaseTypes) {
    CaseTypes[CaseTypes["Ban"] = 1] = "Ban";
    CaseTypes[CaseTypes["Unban"] = 2] = "Unban";
    CaseTypes[CaseTypes["Note"] = 3] = "Note";
    CaseTypes[CaseTypes["Warn"] = 4] = "Warn";
    CaseTypes[CaseTypes["Kick"] = 5] = "Kick";
    CaseTypes[CaseTypes["Mute"] = 6] = "Mute";
    CaseTypes[CaseTypes["Unmute"] = 7] = "Unmute";
    CaseTypes[CaseTypes["Deleted"] = 8] = "Deleted";
    CaseTypes[CaseTypes["Softban"] = 9] = "Softban";
})(CaseTypes = exports.CaseTypes || (exports.CaseTypes = {}));
exports.CaseNameToType = {
    ban: CaseTypes.Ban,
    unban: CaseTypes.Unban,
    note: CaseTypes.Note,
    warn: CaseTypes.Warn,
    kick: CaseTypes.Kick,
    mute: CaseTypes.Mute,
    unmute: CaseTypes.Unmute,
    deleted: CaseTypes.Deleted,
    softban: CaseTypes.Softban,
};
exports.CaseTypeToName = Object.entries(exports.CaseNameToType).reduce((map, [name, type]) => {
    map[type] = name;
    return map;
}, {});
