"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanSearchCmd = exports.banSearchSignature = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const search_1 = require("../search");
// Separate from BanSearchCmd to avoid a circular reference from ./search.ts
exports.banSearchSignature = {
    query: commandTypes_1.commandTypeHelpers.string({ catchAll: true }),
    page: commandTypes_1.commandTypeHelpers.number({ option: true, shortcut: "p" }),
    sort: commandTypes_1.commandTypeHelpers.string({ option: true }),
    "case-sensitive": commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "cs" }),
    export: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "e" }),
    ids: commandTypes_1.commandTypeHelpers.switchOption(),
    regex: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "re" }),
};
exports.BanSearchCmd = types_1.utilityCmd({
    trigger: ["bansearch", "bs"],
    description: "Search banned users",
    usage: "!bansearch dragory",
    permission: "can_search",
    signature: exports.banSearchSignature,
    run({ pluginData, message, args }) {
        if (args.export) {
            return search_1.archiveSearch(pluginData, args, search_1.SearchType.BanSearch, message);
        }
        else {
            return search_1.displaySearch(pluginData, args, search_1.SearchType.BanSearch, message);
        }
    },
});
