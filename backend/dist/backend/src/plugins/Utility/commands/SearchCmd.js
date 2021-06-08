"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCmd = exports.searchCmdSignature = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const search_1 = require("../search");
// Separate from SearchCmd to avoid a circular reference from ./search.ts
exports.searchCmdSignature = {
    query: commandTypes_1.commandTypeHelpers.string({ catchAll: true, required: false }),
    page: commandTypes_1.commandTypeHelpers.number({ option: true, shortcut: "p" }),
    role: commandTypes_1.commandTypeHelpers.string({ option: true, shortcut: "r" }),
    voice: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "v" }),
    bot: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "b" }),
    sort: commandTypes_1.commandTypeHelpers.string({ option: true }),
    "case-sensitive": commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "cs" }),
    export: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "e" }),
    ids: commandTypes_1.commandTypeHelpers.switchOption(),
    regex: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "re" }),
    "status-search": commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "ss" }),
};
exports.SearchCmd = types_1.utilityCmd({
    trigger: ["search", "s"],
    description: "Search server members",
    usage: "!search dragory",
    permission: "can_search",
    signature: exports.searchCmdSignature,
    run({ pluginData, message, args }) {
        if (args.export) {
            return search_1.archiveSearch(pluginData, args, search_1.SearchType.MemberSearch, message);
        }
        else {
            return search_1.displaySearch(pluginData, args, search_1.SearchType.MemberSearch, message);
        }
    },
});
