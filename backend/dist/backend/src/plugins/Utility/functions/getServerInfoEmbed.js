"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerInfoEmbed = void 0;
const utils_1 = require("../../../utils");
const eris_1 = require("eris");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const getGuildPreview_1 = require("./getGuildPreview");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
async function getServerInfoEmbed(pluginData, serverId, requestMemberId) {
    const thisServer = serverId === pluginData.guild.id ? pluginData.guild : null;
    const [restGuild, guildPreview] = await Promise.all([
        thisServer
            ? utils_1.memoize(() => pluginData.client.getRESTGuild(serverId), `getRESTGuild_${serverId}`, 10 * utils_1.MINUTES)
            : null,
        getGuildPreview_1.getGuildPreview(pluginData.client, serverId),
    ]);
    if (!restGuild && !guildPreview) {
        return null;
    }
    const features = (restGuild || guildPreview).features;
    if (!thisServer && !features.includes("DISCOVERABLE")) {
        return null;
    }
    const embed = {
        fields: [],
    };
    embed.author = {
        name: `Server:  ${(guildPreview || restGuild).name}`,
        icon_url: (guildPreview || restGuild).iconURL ?? undefined,
    };
    // BASIC INFORMATION
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
    const createdAt = moment_timezone_1.default.utc((guildPreview || restGuild).createdAt, "x");
    const tzCreatedAt = requestMemberId
        ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
        : timeAndDate.inGuildTz(createdAt);
    const prettyCreatedAt = tzCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
    const serverAge = humanize_duration_1.default(moment_timezone_1.default.utc().valueOf() - createdAt.valueOf(), {
        largest: 2,
        round: true,
    });
    const basicInformation = [];
    basicInformation.push(`Created: **${serverAge} ago** (\`${prettyCreatedAt}\`)`);
    if (thisServer) {
        const owner = await utils_1.resolveUser(pluginData.client, thisServer.ownerID);
        const ownerName = `${owner.username}#${owner.discriminator}`;
        basicInformation.push(`Owner: **${ownerName}** (\`${thisServer.ownerID}\`)`);
        basicInformation.push(`Voice region: **${thisServer.region}**`);
    }
    if (features.length > 0) {
        basicInformation.push(`Features: ${features.join(", ")}`);
    }
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Basic information",
        value: basicInformation.join("\n"),
    });
    // IMAGE LINKS
    const iconUrl = `[Link](${(restGuild || guildPreview).iconURL})`;
    const bannerUrl = restGuild?.bannerURL ? `[Link](${restGuild.bannerURL})` : "None";
    const splashUrl = (restGuild || guildPreview).splashURL != null
        ? `[Link](${(restGuild || guildPreview).splashURL?.replace("size=128", "size=2048")})`
        : "None";
    embed.fields.push({
        name: "Server icon",
        value: iconUrl,
        inline: true,
    }, {
        name: "Invite splash",
        value: splashUrl,
        inline: true,
    }, {
        name: "Server banner",
        value: bannerUrl,
        inline: true,
    });
    // MEMBER COUNTS
    const totalMembers = guildPreview?.approximateMemberCount ||
        restGuild?.approximateMemberCount ||
        restGuild?.memberCount ||
        thisServer?.memberCount ||
        thisServer?.members.size ||
        0;
    let onlineMemberCount = (guildPreview?.approximatePresenceCount || restGuild?.approximatePresenceCount);
    if (onlineMemberCount == null && restGuild?.vanityURL) {
        // For servers with a vanity URL, we can also use the numbers from the invite for online count
        const invite = await utils_1.resolveInvite(pluginData.client, restGuild.vanityURL, true);
        if (invite && utils_1.inviteHasCounts(invite)) {
            onlineMemberCount = invite.presenceCount;
        }
    }
    if (!onlineMemberCount && thisServer) {
        onlineMemberCount = thisServer.members.filter(m => m.status !== "offline").length; // Extremely inaccurate fallback
    }
    const offlineMemberCount = totalMembers - onlineMemberCount;
    let memberCountTotalLines = `Total: **${utils_1.formatNumber(totalMembers)}**`;
    if (restGuild?.maxMembers) {
        memberCountTotalLines += `\nMax: **${utils_1.formatNumber(restGuild.maxMembers)}**`;
    }
    let memberCountOnlineLines = `Online: **${utils_1.formatNumber(onlineMemberCount)}**`;
    if (restGuild?.maxPresences) {
        memberCountOnlineLines += `\nMax online: **${utils_1.formatNumber(restGuild.maxPresences)}**`;
    }
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Members",
        inline: true,
        value: utils_1.trimLines(`
          ${memberCountTotalLines}
          ${memberCountOnlineLines}
          Offline: **${utils_1.formatNumber(offlineMemberCount)}**
        `),
    });
    // CHANNEL COUNTS
    if (thisServer) {
        const totalChannels = thisServer.channels.size;
        const categories = thisServer.channels.filter(channel => channel instanceof eris_1.CategoryChannel);
        const textChannels = thisServer.channels.filter(channel => channel instanceof eris_1.TextChannel);
        const voiceChannels = thisServer.channels.filter(channel => channel instanceof eris_1.VoiceChannel);
        embed.fields.push({
            name: utils_1.preEmbedPadding + "Channels",
            inline: true,
            value: utils_1.trimLines(`
          Total: **${totalChannels}** / 500
          Categories: **${categories.length}**
          Text: **${textChannels.length}**
          Voice: **${voiceChannels.length}**
        `),
        });
    }
    // OTHER STATS
    const otherStats = [];
    if (thisServer) {
        otherStats.push(`Roles: **${thisServer.roles.size}** / 250`);
    }
    if (restGuild) {
        const maxEmojis = {
            0: 50,
            1: 100,
            2: 150,
            3: 250,
        }[restGuild.premiumTier] || 50;
        otherStats.push(`Emojis: **${restGuild.emojis.length}** / ${maxEmojis * 2}`);
    }
    else {
        otherStats.push(`Emojis: **${guildPreview.emojis.length}**`);
    }
    if (thisServer) {
        otherStats.push(`Boosts: **${thisServer.premiumSubscriptionCount ?? 0}** (level ${thisServer.premiumTier})`);
    }
    embed.fields.push({
        name: utils_1.preEmbedPadding + "Other stats",
        inline: true,
        value: otherStats.join("\n"),
    });
    if (!thisServer) {
        embed.footer = {
            text: "⚠️ Only showing publicly available information for this server",
        };
    }
    return embed;
}
exports.getServerInfoEmbed = getServerInfoEmbed;
