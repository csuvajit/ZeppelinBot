"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersCmd = void 0;
const types_1 = require("../types");
const pluginUtils_1 = require("../../../pluginUtils");
const commandTypes_1 = require("../../../commandTypes");
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const utils_1 = require("../../../utils");
exports.ServersCmd = types_1.botControlCmd({
    trigger: ["servers", "guilds"],
    permission: null,
    config: {
        preFilters: [pluginUtils_1.isOwnerPreFilter],
    },
    signature: {
        search: commandTypes_1.commandTypeHelpers.string({ catchAll: true, required: false }),
        all: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "a" }),
        initialized: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "i" }),
        uninitialized: commandTypes_1.commandTypeHelpers.switchOption({ shortcut: "u" }),
    },
    async run({ pluginData, message: msg, args }) {
        const showList = Boolean(args.all || args.initialized || args.uninitialized || args.search);
        const search = args.search ? new RegExp([...args.search].map(s => escape_string_regexp_1.default(s)).join(".*"), "i") : null;
        const joinedGuilds = Array.from(pluginData.client.guilds.values());
        const loadedGuilds = pluginData.getKnubInstance().getLoadedGuilds();
        const loadedGuildsMap = loadedGuilds.reduce((map, guildData) => map.set(guildData.guildId, guildData), new Map());
        if (showList) {
            let filteredGuilds = Array.from(joinedGuilds);
            if (args.initialized) {
                filteredGuilds = filteredGuilds.filter(g => loadedGuildsMap.has(g.id));
            }
            if (args.uninitialized) {
                filteredGuilds = filteredGuilds.filter(g => !loadedGuildsMap.has(g.id));
            }
            if (args.search) {
                filteredGuilds = filteredGuilds.filter(g => search.test(`${g.id} ${g.name}`));
            }
            if (filteredGuilds.length) {
                filteredGuilds.sort(utils_1.sorter(g => g.name.toLowerCase()));
                const longestId = filteredGuilds.reduce((longest, guild) => Math.max(longest, guild.id.length), 0);
                const lines = filteredGuilds.map(g => {
                    const paddedId = g.id.padEnd(longestId, " ");
                    const owner = utils_1.getUser(pluginData.client, g.ownerID);
                    return `\`${paddedId}\` **${g.name}** (${g.memberCount} members) (owner **${owner.username}#${owner.discriminator}** \`${owner.id}\`)`;
                });
                utils_1.createChunkedMessage(msg.channel, lines.join("\n"));
            }
            else {
                msg.channel.createMessage("No servers matched the filters");
            }
        }
        else {
            const total = joinedGuilds.length;
            const initialized = joinedGuilds.filter(g => loadedGuildsMap.has(g.id)).length;
            const unInitialized = total - initialized;
            msg.channel.createMessage(`I am on **${total} total servers**, of which **${initialized} are initialized** and **${unInitialized} are not initialized**`);
        }
    },
});
