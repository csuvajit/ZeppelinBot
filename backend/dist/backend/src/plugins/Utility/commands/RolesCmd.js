"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const utils_1 = require("../../../utils");
const refreshMembers_1 = require("../refreshMembers");
const pluginUtils_1 = require("../../../pluginUtils");
exports.RolesCmd = types_1.utilityCmd({
    trigger: "roles",
    description: "List all roles or roles matching a search",
    usage: "!roles mod",
    permission: "can_roles",
    signature: {
        search: commandTypes_1.commandTypeHelpers.string({ required: false, catchAll: true }),
        counts: commandTypes_1.commandTypeHelpers.switchOption(),
        sort: commandTypes_1.commandTypeHelpers.string({ option: true }),
    },
    async run({ message: msg, args, pluginData }) {
        const { guild } = pluginData;
        let roles = Array.from(msg.channel.guild.roles.values());
        let sort = args.sort;
        if (args.search) {
            const searchStr = args.search.toLowerCase();
            roles = roles.filter(r => r.name.toLowerCase().includes(searchStr) || r.id === searchStr);
        }
        if (args.counts) {
            await refreshMembers_1.refreshMembersIfNeeded(guild);
            // If the user requested role member counts as well, calculate them and sort the roles by their member count
            const roleCounts = Array.from(guild.members.values()).reduce((map, member) => {
                for (const roleId of member.roles) {
                    if (!map.has(roleId))
                        map.set(roleId, 0);
                    map.set(roleId, map.get(roleId) + 1);
                }
                return map;
            }, new Map());
            // The "everyone" role always has all members in it
            roleCounts.set(guild.id, guild.memberCount);
            for (const role of roles) {
                role._memberCount = roleCounts.has(role.id) ? roleCounts.get(role.id) : 0;
            }
            if (!sort)
                sort = "-memberCount";
            roles.sort((a, b) => {
                if (a._memberCount > b._memberCount)
                    return -1;
                if (a._memberCount < b._memberCount)
                    return 1;
                return 0;
            });
        }
        else {
            // Otherwise sort by name
            roles.sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1;
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                return 0;
            });
        }
        if (!sort)
            sort = "name";
        let sortDir = "ASC";
        if (sort && sort[0] === "-") {
            sort = sort.slice(1);
            sortDir = "DESC";
        }
        if (sort === "position" || sort === "order") {
            roles.sort(utils_1.sorter("position", sortDir));
        }
        else if (sort === "memberCount" && args.counts) {
            roles.sort(utils_1.sorter("_memberCount", sortDir));
        }
        else if (sort === "name") {
            roles.sort(utils_1.sorter(r => r.name.toLowerCase(), sortDir));
        }
        else {
            pluginUtils_1.sendErrorMessage(pluginData, msg.channel, "Unknown sorting method");
            return;
        }
        const longestId = roles.reduce((longest, role) => Math.max(longest, role.id.length), 0);
        const chunks = utils_1.chunkArray(roles, 20);
        for (const [i, chunk] of chunks.entries()) {
            const roleLines = chunk.map(role => {
                const paddedId = role.id.padEnd(longestId, " ");
                let line = `${paddedId} ${role.name}`;
                if (role._memberCount != null) {
                    line += role._memberCount === 1 ? ` (${role._memberCount} member)` : ` (${role._memberCount} members)`;
                }
                return line;
            });
            if (i === 0) {
                msg.channel.createMessage(utils_1.trimLines(`
          ${args.search ? "Total roles found" : "Total roles"}: ${roles.length}
          \`\`\`py\n${roleLines.join("\n")}\`\`\`
        `));
            }
            else {
                msg.channel.createMessage("```py\n" + roleLines.join("\n") + "```");
            }
        }
    },
});
