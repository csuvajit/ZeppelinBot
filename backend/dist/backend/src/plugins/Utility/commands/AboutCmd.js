"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutCmd = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const uptime_1 = require("../../../uptime");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const last_commit_log_1 = __importDefault(require("last-commit-log"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const paths_1 = require("../../../paths");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
exports.AboutCmd = types_1.utilityCmd({
    trigger: "about",
    description: "Show information about Zeppelin's status on the server",
    permission: "can_about",
    async run({ message: msg, pluginData }) {
        const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
        const uptime = uptime_1.getCurrentUptime();
        const prettyUptime = humanize_duration_1.default(uptime, { largest: 2, round: true });
        let lastCommit;
        try {
            const lcl = new last_commit_log_1.default(paths_1.rootDir);
            lastCommit = await lcl.getLastCommit();
        }
        catch { } // tslint:disable-line:no-empty
        let lastUpdate;
        let version;
        if (lastCommit) {
            lastUpdate = timeAndDate
                .inGuildTz(moment_timezone_1.default.utc(lastCommit.committer.date, "X"))
                .format(pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin).getDateFormat("pretty_datetime"));
            version = lastCommit.shortHash;
        }
        else {
            lastUpdate = "?";
            version = "?";
        }
        const shard = pluginData.client.shards.get(pluginData.client.guildShardMap[pluginData.guild.id]);
        const lastReload = humanize_duration_1.default(Date.now() - pluginData.state.lastReload, {
            largest: 2,
            round: true,
        });
        const basicInfoRows = [
            ["Uptime", prettyUptime],
            ["Last reload", `${lastReload} ago`],
            ["Last update", lastUpdate],
            ["Version", version],
            ["API latency", `${shard.latency}ms`],
            ["Server timezone", timeAndDate.getGuildTz()],
        ];
        const loadedPlugins = Array.from(pluginData
            .getKnubInstance()
            .getLoadedGuild(pluginData.guild.id)
            .loadedPlugins.keys());
        loadedPlugins.sort();
        const aboutContent = {
            embed: {
                title: `About ${pluginData.client.user.username}`,
                fields: [
                    {
                        name: "Status",
                        value: basicInfoRows
                            .map(([label, value]) => {
                            return `${label}: **${value}**`;
                        })
                            .join("\n"),
                    },
                    {
                        name: `Loaded plugins on this server (${loadedPlugins.length})`,
                        value: loadedPlugins.join(", "),
                    },
                ],
            },
        };
        const supporters = await pluginData.state.supporters.getAll();
        supporters.sort(utils_1.multiSorter([
            [r => r.amount, "DESC"],
            [r => r.name.toLowerCase(), "ASC"],
        ]));
        if (supporters.length) {
            aboutContent.embed.fields.push({
                name: "Zeppelin supporters 🎉",
                value: supporters.map(s => `**${s.name}** ${s.amount ? `${s.amount}€/mo` : ""}`.trim()).join("\n"),
            });
        }
        // For the embed color, find the highest colored role the bot has - this is their color on the server as well
        const botMember = await utils_1.resolveMember(pluginData.client, pluginData.guild, pluginData.client.user.id);
        let botRoles = botMember?.roles.map(r => msg.channel.guild.roles.get(r)) || [];
        botRoles = botRoles.filter(r => !!r); // Drop any unknown roles
        botRoles = botRoles.filter(r => r.color); // Filter to those with a color
        botRoles.sort(utils_1.sorter("position", "DESC")); // Sort by position (highest first)
        if (botRoles.length) {
            aboutContent.embed.color = botRoles[0].color;
        }
        // Use the bot avatar as the embed image
        if (pluginData.client.user.avatarURL) {
            aboutContent.embed.thumbnail = { url: pluginData.client.user.avatarURL };
        }
        msg.channel.createMessage(aboutContent);
    },
});
