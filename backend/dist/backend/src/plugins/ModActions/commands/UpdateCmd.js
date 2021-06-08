"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const updateCase_1 = require("../functions/updateCase");
exports.UpdateCmd = types_1.modActionsCmd({
    trigger: ["update", "reason"],
    permission: "can_note",
    description: "Update the specified case (or, if case number is omitted, your latest case) by adding more notes/details to it",
    signature: [
        {
            caseNumber: commandTypes_1.commandTypeHelpers.number(),
            note: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
        },
        {
            note: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
        },
    ],
    async run({ pluginData, message: msg, args }) {
        await updateCase_1.updateCase(pluginData, msg, args);
    },
});
