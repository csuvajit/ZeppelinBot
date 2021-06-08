"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimEmptyLines = exports.trimLines = exports.isUnicodeEmoji = exports.isEmoji = exports.getEmojiInString = exports.customEmojiRegex = exports.unicodeEmojiRegex = exports.getInviteCodesInString = exports.isNotNull = exports.parseInviteCodeInput = exports.getUrlsInString = exports.findRelevantAuditLogEntry = exports.sleep = exports.isSnowflake = exports.snowflakeRegex = exports.stripObjectToScalars = exports.has = exports.get = exports.errorMessage = exports.successMessage = exports.convertMSToDelayString = exports.convertDelayStringToMS = exports.tDelayString = exports.tDateTime = exports.tAlphanumeric = exports.dropPropertiesByName = exports.tAllowedMentions = exports.tMessageContent = exports.tStrictMessageContent = exports.tEmbed = exports.nonNullish = exports.tPartialDictionary = exports.tDeepPartial = exports.tNormalizedNullOptional = exports.tNormalizedNullOrUndefined = exports.tNullable = exports.isDiscordRESTError = exports.isDiscordHTTPError = exports.DISCORD_REST_ERROR_NAME = exports.DISCORD_HTTP_ERROR_NAME = exports.isValidSnowflake = exports.MAX_SNOWFLAKE = exports.MIN_SNOWFLAKE = exports.EMPTY_CHAR = exports.WEEKS = exports.DAYS = exports.HOURS = exports.MINUTES = exports.SECONDS = exports.MS = void 0;
exports.renderRecursively = exports.memoize = exports.formatNumber = exports.isValidEmbed = exports.messageLink = exports.verboseChannelMention = exports.verboseUserName = exports.verboseUserMention = exports.messageSummary = exports.confirm = exports.resolveInvite = exports.resolveRoleId = exports.resolveMember = exports.resolveUser = exports.getUser = exports.resolveUserId = exports.deepKeyIntersect = exports.isObjectLiteral = exports.UnknownUser = exports.ucfirst = exports.notifyUser = exports.createUserNotificationError = exports.disableUserNotificationStrings = exports.noop = exports.sorter = exports.multiSorter = exports.simpleClosestStringMatch = exports.downloadFile = exports.createChunkedMessage = exports.chunkMessageLines = exports.chunkLines = exports.chunkArray = exports.useMediaUrls = exports.disableCodeBlocks = exports.disableInlineCode = exports.deactivateMentions = exports.disableLinkPreviews = exports.getRoleMentions = exports.getUserMentions = exports.channelMentionRegex = exports.roleMentionRegex = exports.userMentionRegex = exports.embedPadding = exports.preEmbedPadding = exports.emptyEmbedValue = exports.indentLines = exports.indentLine = exports.trimIndents = exports.trimEmptyStartEndLines = exports.asSingleLine = void 0;
exports.DBDateFormat = exports.unique = exports.asyncMap = exports.inviteHasCounts = exports.isGroupDMInvite = exports.isGuildInvite = exports.isFullMessage = exports.trimPluginDescription = exports.trimMultilineString = exports.canUseEmoji = exports.isValidEmoji = void 0;
const eris_1 = require("eris");
const url_1 = require("url");
const tlds_1 = __importDefault(require("tlds"));
const emoji_regex_1 = __importDefault(require("emoji-regex"));
const t = __importStar(require("io-ts"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const tmp_1 = __importDefault(require("tmp"));
const knub_1 = require("knub");
const validatorUtils_1 = require("./validatorUtils");
const Either_1 = require("fp-ts/lib/Either");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const SimpleCache_1 = require("./SimpleCache");
const function_1 = require("fp-ts/lib/function");
const sendDM_1 = require("./utils/sendDM");
const fsp = fs_1.default.promises;
const delayStringMultipliers = {
    w: 1000 * 60 * 60 * 24 * 7,
    d: 1000 * 60 * 60 * 24,
    h: 1000 * 60 * 60,
    m: 1000 * 60,
    s: 1000,
    x: 1,
};
exports.MS = 1;
exports.SECONDS = 1000 * exports.MS;
exports.MINUTES = 60 * exports.SECONDS;
exports.HOURS = 60 * exports.MINUTES;
exports.DAYS = 24 * exports.HOURS;
exports.WEEKS = 7 * 24 * exports.HOURS;
exports.EMPTY_CHAR = "\u200b";
// https://discord.com/developers/docs/reference#snowflakes
exports.MIN_SNOWFLAKE = 135169;
// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
exports.MAX_SNOWFLAKE = BigInt("0b1111111111111111111111111111111111111111111111111111111111111111");
const snowflakePattern = /^[1-9]\d+$/;
function isValidSnowflake(str) {
    if (!str.match(snowflakePattern))
        return false;
    if (parseInt(str, 10) < exports.MIN_SNOWFLAKE)
        return false;
    if (BigInt(str) > exports.MAX_SNOWFLAKE)
        return false;
    return true;
}
exports.isValidSnowflake = isValidSnowflake;
exports.DISCORD_HTTP_ERROR_NAME = "DiscordHTTPError";
exports.DISCORD_REST_ERROR_NAME = "DiscordRESTError";
function isDiscordHTTPError(err) {
    return typeof err === "object" && err.constructor?.name === exports.DISCORD_HTTP_ERROR_NAME;
}
exports.isDiscordHTTPError = isDiscordHTTPError;
function isDiscordRESTError(err) {
    return typeof err === "object" && err.constructor?.name === exports.DISCORD_REST_ERROR_NAME;
}
exports.isDiscordRESTError = isDiscordRESTError;
function tNullable(type) {
    return t.union([type, t.undefined, t.null], `Nullable<${type.name}>`);
}
exports.tNullable = tNullable;
function typeHasProps(type) {
    return type.props != null;
}
function typeIsArray(type) {
    return type._tag === "ArrayType";
}
exports.tNormalizedNullOrUndefined = new t.Type("tNormalizedNullOrUndefined", (v) => typeof v === "undefined", (v, c) => (v == null ? t.success(undefined) : t.failure(v, c, "Value must be null or undefined")), s => undefined);
/**
 * Similar to `tNullable`, but normalizes both `null` and `undefined` to `undefined`.
 * This allows adding optional config options that can be "removed" by setting the value to `null`.
 */
function tNormalizedNullOptional(type) {
    return t.union([type, exports.tNormalizedNullOrUndefined], `Optional<${type.name}>`);
}
exports.tNormalizedNullOptional = tNormalizedNullOptional;
function tDeepPartial(type) {
    if (type instanceof t.InterfaceType || type instanceof t.PartialType) {
        const newProps = {};
        for (const [key, prop] of Object.entries(type.props)) {
            newProps[key] = tDeepPartial(prop);
        }
        return t.partial(newProps);
    }
    else if (type instanceof t.DictionaryType) {
        return t.record(type.domain, tDeepPartial(type.codomain));
    }
    else if (type instanceof t.UnionType) {
        return t.union(type.types.map(unionType => tDeepPartial(unionType)));
    }
    else if (type instanceof t.IntersectionType) {
        const types = type.types.map(intersectionType => tDeepPartial(intersectionType));
        return t.intersection(types);
    }
    else if (type instanceof t.ArrayType) {
        return t.array(tDeepPartial(type.type));
    }
    else {
        return type;
    }
}
exports.tDeepPartial = tDeepPartial;
function tDeepPartialProp(prop) {
    if (typeHasProps(prop)) {
        return tDeepPartial(prop);
    }
    else if (typeIsArray(prop)) {
        return t.array(tDeepPartialProp(prop.type));
    }
    else {
        return prop;
    }
}
const tPartialDictionary = (domain, codomain, name) => {
    return function_1.unsafeCoerce(t.record(t.union([domain, t.undefined]), codomain, name));
};
exports.tPartialDictionary = tPartialDictionary;
function nonNullish(v) {
    return v != null;
}
exports.nonNullish = nonNullish;
/**
 * Mirrors EmbedOptions from Eris
 */
exports.tEmbed = t.type({
    title: tNullable(t.string),
    description: tNullable(t.string),
    url: tNullable(t.string),
    timestamp: tNullable(t.string),
    color: tNullable(t.number),
    footer: tNullable(t.type({
        text: t.string,
        icon_url: tNullable(t.string),
        proxy_icon_url: tNullable(t.string),
    })),
    image: tNullable(t.type({
        url: tNullable(t.string),
        proxy_url: tNullable(t.string),
        width: tNullable(t.number),
        height: tNullable(t.number),
    })),
    thumbnail: tNullable(t.type({
        url: tNullable(t.string),
        proxy_url: tNullable(t.string),
        width: tNullable(t.number),
        height: tNullable(t.number),
    })),
    video: tNullable(t.type({
        url: tNullable(t.string),
        width: tNullable(t.number),
        height: tNullable(t.number),
    })),
    provider: tNullable(t.type({
        name: t.string,
        url: tNullable(t.string),
    })),
    fields: tNullable(t.array(t.type({
        name: tNullable(t.string),
        value: tNullable(t.string),
        inline: tNullable(t.boolean),
    }))),
    author: tNullable(t.type({
        name: t.string,
        url: tNullable(t.string),
        width: tNullable(t.number),
        height: tNullable(t.number),
    })),
});
exports.tStrictMessageContent = t.type({
    content: tNullable(t.string),
    tts: tNullable(t.boolean),
    disableEveryone: tNullable(t.boolean),
    embed: tNullable(exports.tEmbed),
});
exports.tMessageContent = t.union([t.string, exports.tStrictMessageContent]);
/**
 * Mirrors AllowedMentions from Eris
 */
exports.tAllowedMentions = t.type({
    everyone: tNormalizedNullOptional(t.boolean),
    users: tNormalizedNullOptional(t.union([t.boolean, t.array(t.string)])),
    roles: tNormalizedNullOptional(t.union([t.boolean, t.array(t.string)])),
    repliedUser: tNormalizedNullOptional(t.boolean),
});
function dropPropertiesByName(obj, propName) {
    if (obj.hasOwnProperty(propName))
        delete obj[propName];
    for (const value of Object.values(obj)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            dropPropertiesByName(value, propName);
        }
    }
}
exports.dropPropertiesByName = dropPropertiesByName;
exports.tAlphanumeric = new t.Type("tAlphanumeric", (s) => typeof s === "string", (from, to) => Either_1.either.chain(t.string.validate(from, to), s => {
    return s.match(/\W/) ? t.failure(from, to, "String must be alphanumeric") : t.success(s);
}), s => s);
exports.tDateTime = new t.Type("tDateTime", (s) => typeof s === "string", (from, to) => Either_1.either.chain(t.string.validate(from, to), s => {
    const parsed = s.length === 10 ? moment_timezone_1.default.utc(s, "YYYY-MM-DD") : s.length === 19 ? moment_timezone_1.default.utc(s, "YYYY-MM-DD HH:mm:ss") : null;
    return parsed && parsed.isValid() ? t.success(s) : t.failure(from, to, "Invalid datetime");
}), s => s);
exports.tDelayString = new t.Type("tDelayString", (s) => typeof s === "string", (from, to) => Either_1.either.chain(t.string.validate(from, to), s => {
    const ms = convertDelayStringToMS(s);
    return ms === null ? t.failure(from, to, "Invalid delay string") : t.success(s);
}), s => s);
// To avoid running into issues with the JS max date vaLue, we cap maximum delay strings *far* below that.
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#The_ECMAScript_epoch_and_timestamps
const MAX_DELAY_STRING_AMOUNT = 100 * 365 * exports.DAYS;
/**
 * Turns a "delay string" such as "1h30m" to milliseconds
 */
function convertDelayStringToMS(str, defaultUnit = "m") {
    const regex = /^([0-9]+)\s*([wdhms])?[a-z]*\s*/;
    let match;
    let ms = 0;
    str = str.trim();
    // tslint:disable-next-line
    while (str !== "" && (match = str.match(regex)) !== null) {
        ms += match[1] * ((match[2] && delayStringMultipliers[match[2]]) || delayStringMultipliers[defaultUnit]);
        str = str.slice(match[0].length);
    }
    // Invalid delay string
    if (str !== "") {
        return null;
    }
    if (ms > MAX_DELAY_STRING_AMOUNT) {
        return null;
    }
    return ms;
}
exports.convertDelayStringToMS = convertDelayStringToMS;
function convertMSToDelayString(ms) {
    let result = "";
    let remaining = ms;
    for (const [abbr, multiplier] of Object.entries(delayStringMultipliers)) {
        if (multiplier <= remaining) {
            const amount = Math.floor(remaining / multiplier);
            result += `${amount}${abbr}`;
            remaining -= amount * multiplier;
        }
        if (remaining === 0)
            break;
    }
    return result;
}
exports.convertMSToDelayString = convertMSToDelayString;
function successMessage(str, emoji = "<:zep_check:851721977798721536>") {
    return emoji ? `${emoji} ${str}` : str;
}
exports.successMessage = successMessage;
function errorMessage(str, emoji = "⚠") {
    return emoji ? `${emoji} ${str}` : str;
}
exports.errorMessage = errorMessage;
function get(obj, path, def) {
    let cursor = obj;
    const pathParts = path.split(".");
    for (const part of pathParts) {
        // hasOwnProperty check here is necessary to prevent prototype traversal in tags
        if (!cursor.hasOwnProperty(part))
            return def;
        cursor = cursor[part];
        if (cursor === undefined)
            return def;
        if (cursor == null)
            return null;
    }
    return cursor;
}
exports.get = get;
function has(obj, path) {
    return get(obj, path) !== undefined;
}
exports.has = has;
function stripObjectToScalars(obj, includedNested = []) {
    const result = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (obj[key] == null ||
            typeof obj[key] === "string" ||
            typeof obj[key] === "number" ||
            typeof obj[key] === "boolean") {
            result[key] = obj[key];
        }
        else if (typeof obj[key] === "object") {
            const prefix = `${key}.`;
            const nestedNested = includedNested
                .filter(p => p === key || p.startsWith(prefix))
                .map(p => (p === key ? p : p.slice(prefix.length)));
            if (nestedNested.length) {
                result[key] = stripObjectToScalars(obj[key], nestedNested);
            }
        }
    }
    return result;
}
exports.stripObjectToScalars = stripObjectToScalars;
exports.snowflakeRegex = /[1-9][0-9]{5,19}/;
const isSnowflakeRegex = new RegExp(`^${exports.snowflakeRegex.source}$`);
function isSnowflake(v) {
    return isSnowflakeRegex.test(v);
}
exports.isSnowflake = isSnowflake;
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
/**
 * Attempts to find a relevant audit log entry for the given user and action
 */
const auditLogNextAttemptAfterFail = new Map();
const AUDIT_LOG_FAIL_COOLDOWN = 2 * exports.MINUTES;
async function findRelevantAuditLogEntry(guild, actionType, userId, attempts = 3, attemptDelay = 3000) {
    if (auditLogNextAttemptAfterFail.has(guild.id) && auditLogNextAttemptAfterFail.get(guild.id) > Date.now()) {
        return null;
    }
    let auditLogs = null;
    try {
        auditLogs = await guild.getAuditLogs(5, undefined, actionType);
    }
    catch (e) {
        if (isDiscordRESTError(e) && e.code === 50013) {
            // If we don't have permission to read audit log, set audit log requests on cooldown
            auditLogNextAttemptAfterFail.set(guild.id, Date.now() + AUDIT_LOG_FAIL_COOLDOWN);
        }
        else if (isDiscordHTTPError(e) && e.code === 500) {
            // Ignore internal server errors which seem to be pretty common with audit log requests
        }
        else if (e.message.startsWith("Request timed out")) {
            // Ignore timeouts, try again next loop
        }
        else {
            throw e;
        }
    }
    const entries = auditLogs ? auditLogs.entries : [];
    entries.sort((a, b) => {
        if (a.createdAt > b.createdAt)
            return -1;
        if (a.createdAt > b.createdAt)
            return 1;
        return 0;
    });
    const cutoffTS = Date.now() - 1000 * 60 * 2;
    const relevantEntry = entries.find(entry => {
        return entry.targetID === userId && entry.createdAt >= cutoffTS;
    });
    if (relevantEntry) {
        return relevantEntry;
    }
    else if (attempts > 0) {
        await sleep(attemptDelay);
        return findRelevantAuditLogEntry(guild, actionType, userId, attempts - 1, attemptDelay);
    }
    else {
        return null;
    }
}
exports.findRelevantAuditLogEntry = findRelevantAuditLogEntry;
const realLinkRegex = /https?:\/\/\S+/; // http://anything or https://anything
const plainLinkRegex = /((?!https?:\/\/)\S)+\.\S+/; // anything.anything, without http:// or https:// preceding it
// Both of the above, with precedence on the first one
const urlRegex = new RegExp(`(${realLinkRegex.source}|${plainLinkRegex.source})`, "g");
const protocolRegex = /^[a-z]+:\/\//;
function getUrlsInString(str, onlyUnique = false) {
    let matches = str.match(urlRegex) || [];
    if (onlyUnique) {
        matches = unique(matches);
    }
    return matches.reduce((urls, match) => {
        const withProtocol = protocolRegex.test(match) ? match : `https://${match}`;
        let matchUrl;
        try {
            matchUrl = new url_1.URL(withProtocol);
            matchUrl.input = match;
        }
        catch {
            return urls;
        }
        const hostnameParts = matchUrl.hostname.split(".");
        const tld = hostnameParts[hostnameParts.length - 1];
        if (tlds_1.default.includes(tld)) {
            urls.push(matchUrl);
        }
        return urls;
    }, []);
}
exports.getUrlsInString = getUrlsInString;
function parseInviteCodeInput(str) {
    if (str.match(/^[a-z0-9]{6,}$/i)) {
        return str;
    }
    return getInviteCodesInString(str)[0];
}
exports.parseInviteCodeInput = parseInviteCodeInput;
function isNotNull(value) {
    return value != null;
}
exports.isNotNull = isNotNull;
// discord.com/invite/<code>
// discordapp.com/invite/<code>
// discord.gg/invite/<code>
// discord.gg/<code>
const quickInviteDetection = /(?:discord.com|discordapp.com)\/invite\/([a-z0-9\-]+)|discord.gg\/(?:\S+\/)?([a-z0-9\-]+)/gi;
const isInviteHostRegex = /(?:^|\.)(?:discord.gg|discord.com|discordapp.com)$/i;
const longInvitePathRegex = /^\/invite\/([a-z0-9\-]+)$/i;
function getInviteCodesInString(str) {
    const inviteCodes = [];
    // Clean up markdown
    str = str.replace(/[|*_~]/g, "");
    // Quick detection
    const quickDetectionMatch = str.matchAll(quickInviteDetection);
    if (quickDetectionMatch) {
        inviteCodes.push(...[...quickDetectionMatch].map(m => m[1] || m[2]));
    }
    // Deep detection via URL parsing
    const linksInString = getUrlsInString(str, true);
    const potentialInviteLinks = linksInString.filter(url => isInviteHostRegex.test(url.hostname));
    const withNormalizedPaths = potentialInviteLinks.map(url => {
        url.pathname = url.pathname.replace(/\/{2,}/g, "/").replace(/\/+$/g, "");
        return url;
    });
    const codesFromInviteLinks = withNormalizedPaths
        .map(url => {
        // discord.gg/[anything/]<code>
        if (url.hostname === "discord.gg") {
            const parts = url.pathname.split("/").filter(Boolean);
            return parts[parts.length - 1];
        }
        // discord.com/invite/<code>[/anything]
        // discordapp.com/invite/<code>[/anything]
        const longInviteMatch = url.pathname.match(longInvitePathRegex);
        if (longInviteMatch) {
            return longInviteMatch[1];
        }
        return null;
    })
        .filter(Boolean);
    inviteCodes.push(...codesFromInviteLinks);
    return unique(inviteCodes);
}
exports.getInviteCodesInString = getInviteCodesInString;
exports.unicodeEmojiRegex = emoji_regex_1.default();
exports.customEmojiRegex = /<a?:(.*?):(\d+)>/;
const matchAllEmojiRegex = new RegExp(`(${exports.unicodeEmojiRegex.source})|(${exports.customEmojiRegex.source})`, "g");
function getEmojiInString(str) {
    return str.match(matchAllEmojiRegex) || [];
}
exports.getEmojiInString = getEmojiInString;
function isEmoji(str) {
    return str.match(`^(${exports.unicodeEmojiRegex.source})|(${exports.customEmojiRegex.source})$`) !== null;
}
exports.isEmoji = isEmoji;
function isUnicodeEmoji(str) {
    return str.match(`^${exports.unicodeEmojiRegex.source}$`) !== null;
}
exports.isUnicodeEmoji = isUnicodeEmoji;
function trimLines(str) {
    return str
        .trim()
        .split("\n")
        .map(l => l.trim())
        .join("\n")
        .trim();
}
exports.trimLines = trimLines;
function trimEmptyLines(str) {
    return str
        .split("\n")
        .filter(l => l.trim() !== "")
        .join("\n");
}
exports.trimEmptyLines = trimEmptyLines;
function asSingleLine(str) {
    return trimLines(str).replace(/\n/g, " ");
}
exports.asSingleLine = asSingleLine;
function trimEmptyStartEndLines(str) {
    const lines = str.split("\n");
    let emptyLinesAtStart = 0;
    let emptyLinesAtEnd = 0;
    for (const line of lines) {
        if (line.match(/^\s*$/)) {
            emptyLinesAtStart++;
        }
        else {
            break;
        }
    }
    for (let i = lines.length - 1; i > 0; i--) {
        if (lines[i].match(/^\s*$/)) {
            emptyLinesAtEnd++;
        }
        else {
            break;
        }
    }
    return lines.slice(emptyLinesAtStart, emptyLinesAtEnd ? -1 * emptyLinesAtEnd : undefined).join("\n");
}
exports.trimEmptyStartEndLines = trimEmptyStartEndLines;
function trimIndents(str, indentLength) {
    const regex = new RegExp(`^\\s{0,${indentLength}}`, "g");
    return str
        .split("\n")
        .map(line => line.replace(regex, ""))
        .join("\n");
}
exports.trimIndents = trimIndents;
function indentLine(str, indentLength) {
    return " ".repeat(indentLength) + str;
}
exports.indentLine = indentLine;
function indentLines(str, indentLength) {
    return str
        .split("\n")
        .map(line => indentLine(line, indentLength))
        .join("\n");
}
exports.indentLines = indentLines;
exports.emptyEmbedValue = "\u200b";
exports.preEmbedPadding = exports.emptyEmbedValue + "\n";
exports.embedPadding = "\n" + exports.emptyEmbedValue;
exports.userMentionRegex = /<@!?([0-9]+)>/g;
exports.roleMentionRegex = /<@&([0-9]+)>/g;
exports.channelMentionRegex = /<#([0-9]+)>/g;
function getUserMentions(str) {
    const regex = new RegExp(exports.userMentionRegex.source, "g");
    const userIds = [];
    let match;
    // tslint:disable-next-line
    while ((match = regex.exec(str)) !== null) {
        userIds.push(match[1]);
    }
    return userIds;
}
exports.getUserMentions = getUserMentions;
function getRoleMentions(str) {
    const regex = new RegExp(exports.roleMentionRegex.source, "g");
    const roleIds = [];
    let match;
    // tslint:disable-next-line
    while ((match = regex.exec(str)) !== null) {
        roleIds.push(match[1]);
    }
    return roleIds;
}
exports.getRoleMentions = getRoleMentions;
/**
 * Disable link previews in the given string by wrapping links in < >
 */
function disableLinkPreviews(str) {
    return str.replace(/(?<!<)(https?:\/\/\S+)/gi, "<$1>");
}
exports.disableLinkPreviews = disableLinkPreviews;
function deactivateMentions(content) {
    return content.replace(/@/g, "@\u200b");
}
exports.deactivateMentions = deactivateMentions;
/**
 * Disable inline code in the given string by replacing backticks/grave accents with acute accents
 * FIXME: Find a better way that keeps the grave accents? Can't use the code block approach here since it's just 1 character.
 */
function disableInlineCode(content) {
    return content.replace(/`/g, "\u00b4");
}
exports.disableInlineCode = disableInlineCode;
/**
 * Disable code blocks in the given string by adding invisible unicode characters between backticks
 */
function disableCodeBlocks(content) {
    return content.replace(/`/g, "`\u200b");
}
exports.disableCodeBlocks = disableCodeBlocks;
function useMediaUrls(content) {
    return content.replace(/cdn\.discord(app)?\.com/g, "media.discordapp.net");
}
exports.useMediaUrls = useMediaUrls;
function chunkArray(arr, chunkSize) {
    const chunks = [];
    let currentChunk = [];
    for (let i = 0; i < arr.length; i++) {
        currentChunk.push(arr[i]);
        if ((i !== 0 && i % chunkSize === 0) || i === arr.length - 1) {
            chunks.push(currentChunk);
            currentChunk = [];
        }
    }
    return chunks;
}
exports.chunkArray = chunkArray;
function chunkLines(str, maxChunkLength = 2000) {
    if (str.length < maxChunkLength) {
        return [str];
    }
    const chunks = [];
    while (str.length) {
        if (str.length <= maxChunkLength) {
            chunks.push(str);
            break;
        }
        const slice = str.slice(0, maxChunkLength);
        const lastLineBreakIndex = slice.lastIndexOf("\n");
        if (lastLineBreakIndex === -1) {
            chunks.push(str.slice(0, maxChunkLength));
            str = str.slice(maxChunkLength);
        }
        else {
            chunks.push(str.slice(0, lastLineBreakIndex));
            str = str.slice(lastLineBreakIndex + 1);
        }
    }
    return chunks;
}
exports.chunkLines = chunkLines;
/**
 * Chunks a long message to multiple smaller messages, retaining leading and trailing line breaks, open code blocks, etc.
 *
 * Default maxChunkLength is 1990, a bit under the message length limit of 2000, so we have space to add code block
 * shenanigans to the start/end when needed. Take this into account when choosing a custom maxChunkLength as well.
 */
function chunkMessageLines(str, maxChunkLength = 1990) {
    const chunks = chunkLines(str, maxChunkLength);
    let openCodeBlock = false;
    return chunks.map(chunk => {
        // If the chunk starts with a newline, add an invisible unicode char so Discord doesn't strip it away
        if (chunk[0] === "\n")
            chunk = "\u200b" + chunk;
        // If the chunk ends with a newline, add an invisible unicode char so Discord doesn't strip it away
        if (chunk[chunk.length - 1] === "\n")
            chunk = chunk + "\u200b";
        // If the previous chunk had an open code block, open it here again
        if (openCodeBlock) {
            openCodeBlock = false;
            if (chunk.startsWith("```")) {
                // Edge case: chunk starts with a code block delimiter, e.g. the previous chunk and this one were split right before the end of a code block
                // Fix: just strip the code block delimiter away from here, we don't need it anymore
                chunk = chunk.slice(3);
            }
            else {
                chunk = "```" + chunk;
            }
        }
        // If the chunk has an open code block, close it and open it again in the next chunk
        const codeBlockDelimiters = chunk.match(/```/g);
        if (codeBlockDelimiters && codeBlockDelimiters.length % 2 !== 0) {
            chunk += "```";
            openCodeBlock = true;
        }
        return chunk;
    });
}
exports.chunkMessageLines = chunkMessageLines;
async function createChunkedMessage(channel, messageText, allowedMentions) {
    const chunks = chunkMessageLines(messageText);
    for (const chunk of chunks) {
        await channel.createMessage({ content: chunk, allowedMentions });
    }
}
exports.createChunkedMessage = createChunkedMessage;
/**
 * Downloads the file from the given URL to a temporary file, with retry support
 */
function downloadFile(attachmentUrl, retries = 3) {
    return new Promise(resolve => {
        tmp_1.default.file((err, path, fd, deleteFn) => {
            if (err)
                throw err;
            const writeStream = fs_1.default.createWriteStream(path);
            https_1.default
                .get(attachmentUrl, res => {
                res.pipe(writeStream);
                writeStream.on("finish", () => {
                    writeStream.end();
                    resolve({
                        path,
                        deleteFn,
                    });
                });
            })
                .on("error", httpsErr => {
                fsp.unlink(path);
                if (retries === 0) {
                    throw httpsErr;
                }
                else {
                    console.warn("File download failed, retrying. Error given:", httpsErr.message); // tslint:disable-line
                    resolve(downloadFile(attachmentUrl, retries - 1));
                }
            });
        });
    });
}
exports.downloadFile = downloadFile;
function simpleClosestStringMatch(searchStr, haystack, getter) {
    const normalizedSearchStr = searchStr.toLowerCase();
    // See if any haystack item contains a part of the search string
    const itemsWithRankings = haystack.map(item => {
        const itemStr = getter ? getter(item) : item;
        const normalizedItemStr = itemStr.toLowerCase();
        let i = 0;
        do {
            if (!normalizedItemStr.includes(normalizedSearchStr.slice(0, i + 1)))
                break;
            i++;
        } while (i < normalizedSearchStr.length);
        if (i > 0 && normalizedItemStr.startsWith(normalizedSearchStr.slice(0, i))) {
            // Slightly prioritize items that *start* with the search string
            i += 0.5;
        }
        return [item, i];
    });
    // Sort by best match
    itemsWithRankings.sort((a, b) => {
        return a[1] > b[1] ? -1 : 1;
    });
    if (itemsWithRankings[0][1] === 0) {
        return null;
    }
    return itemsWithRankings[0][0];
}
exports.simpleClosestStringMatch = simpleClosestStringMatch;
function resolveGetter(getter) {
    if (typeof getter === "string") {
        return obj => obj[getter];
    }
    return getter;
}
function multiSorter(getters) {
    const resolvedGetters = getters.map(getter => {
        if (Array.isArray(getter)) {
            return [resolveGetter(getter[0]), getter[1]];
        }
        else {
            return [resolveGetter(getter), "ASC"];
        }
    });
    return (a, b) => {
        for (const getter of resolvedGetters) {
            const aVal = getter[0](a);
            const bVal = getter[0](b);
            if (aVal > bVal)
                return getter[1] === "ASC" ? 1 : -1;
            if (aVal < bVal)
                return getter[1] === "ASC" ? -1 : 1;
        }
        return 0;
    };
}
exports.multiSorter = multiSorter;
function sorter(getter, direction = "ASC") {
    return multiSorter([[getter, direction]]);
}
exports.sorter = sorter;
function noop() {
    // IT'S LITERALLY NOTHING
}
exports.noop = noop;
exports.disableUserNotificationStrings = ["no", "none", "off"];
function createUserNotificationError(text) {
    return {
        method: null,
        success: false,
        text,
    };
}
exports.createUserNotificationError = createUserNotificationError;
/**
 * Attempts to notify the user using one of the specified methods. Only the first one that succeeds will be used.
 * @param methods List of methods to try, in priority order
 */
async function notifyUser(user, body, methods) {
    if (methods.length === 0) {
        return { method: null, success: true };
    }
    let lastError = null;
    for (const method of methods) {
        if (method.type === "dm") {
            try {
                await sendDM_1.sendDM(user, body, "mod action notification");
                return {
                    method,
                    success: true,
                    text: "user notified with a direct message",
                };
            }
            catch (e) {
                lastError = e;
            }
        }
        else if (method.type === "channel") {
            try {
                await method.channel.createMessage({
                    content: `<@!${user.id}> ${body}`,
                    allowedMentions: { users: [user.id] },
                });
                return {
                    method,
                    success: true,
                    text: `user notified in <#${method.channel.id}>`,
                };
            }
            catch (e) {
                lastError = e;
            }
        }
    }
    const errorText = lastError ? `failed to message user: ${lastError.message}` : `failed to message user`;
    return {
        method: null,
        success: false,
        text: errorText,
    };
}
exports.notifyUser = notifyUser;
function ucfirst(str) {
    if (typeof str !== "string" || str === "")
        return str;
    return str[0].toUpperCase() + str.slice(1);
}
exports.ucfirst = ucfirst;
class UnknownUser {
    constructor(props = {}) {
        this.username = "Unknown";
        this.discriminator = "0000";
        for (const key in props) {
            this[key] = props[key];
        }
    }
}
exports.UnknownUser = UnknownUser;
function isObjectLiteral(obj) {
    let deepestPrototype = obj;
    while (Object.getPrototypeOf(deepestPrototype) != null) {
        deepestPrototype = Object.getPrototypeOf(deepestPrototype);
    }
    return Object.getPrototypeOf(obj) === deepestPrototype;
}
exports.isObjectLiteral = isObjectLiteral;
const keyMods = ["+", "-", "="];
function deepKeyIntersect(obj, keyReference) {
    const result = {};
    for (let [key, value] of Object.entries(obj)) {
        if (!keyReference.hasOwnProperty(key)) {
            // Temporary solution so we don't erase keys with modifiers
            // Modifiers will be removed soon(tm) so we can remove this when that happens as well
            let found = false;
            for (const mod of keyMods) {
                if (keyReference.hasOwnProperty(mod + key)) {
                    key = mod + key;
                    found = true;
                    break;
                }
            }
            if (!found)
                continue;
        }
        if (Array.isArray(value)) {
            // Also temp (because modifier shenanigans)
            result[key] = keyReference[key];
        }
        else if (value != null &&
            typeof value === "object" &&
            typeof keyReference[key] === "object" &&
            isObjectLiteral(value)) {
            result[key] = deepKeyIntersect(value, keyReference[key]);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
exports.deepKeyIntersect = deepKeyIntersect;
const unknownUsers = new Set();
const unknownMembers = new Set();
function resolveUserId(bot, value) {
    if (value == null) {
        return null;
    }
    // A user mention?
    const mentionMatch = value.match(/^<@!?(\d+)>$/);
    if (mentionMatch) {
        return mentionMatch[1];
    }
    // A non-mention, full username?
    const usernameMatch = value.match(/^@?([^#]+)#(\d{4})$/);
    if (usernameMatch) {
        const user = bot.users.find(u => u.username === usernameMatch[1] && u.discriminator === usernameMatch[2]);
        if (user)
            return user.id;
    }
    // Just a user ID?
    if (isValidSnowflake(value)) {
        return value;
    }
    return null;
}
exports.resolveUserId = resolveUserId;
/**
 * Finds a matching User for the passed user id, user mention, or full username (with discriminator).
 * If a user is not found, returns an UnknownUser instead.
 */
function getUser(client, userResolvable) {
    const id = resolveUserId(client, userResolvable);
    return id ? client.users.get(id) || new UnknownUser({ id }) : new UnknownUser();
}
exports.getUser = getUser;
async function resolveUser(bot, value) {
    if (typeof value !== "string") {
        return new UnknownUser();
    }
    const userId = resolveUserId(bot, value);
    if (!userId) {
        return new UnknownUser();
    }
    // If we have the user cached, return that directly
    if (bot.users.has(userId)) {
        return bot.users.get(userId);
    }
    // We don't want to spam the API by trying to fetch unknown users again and again,
    // so we cache the fact that they're "unknown" for a while
    if (unknownUsers.has(userId)) {
        return new UnknownUser({ id: userId });
    }
    const freshUser = await bot.getRESTUser(userId).catch(noop);
    if (freshUser) {
        bot.users.add(freshUser, bot);
        return freshUser;
    }
    unknownUsers.add(userId);
    setTimeout(() => unknownUsers.delete(userId), 15 * exports.MINUTES);
    return new UnknownUser({ id: userId });
}
exports.resolveUser = resolveUser;
/**
 * Resolves a guild Member from the passed user id, user mention, or full username (with discriminator).
 * If the member is not found in the cache, it's fetched from the API.
 */
async function resolveMember(bot, guild, value, fresh = false) {
    const userId = resolveUserId(bot, value);
    if (!userId)
        return null;
    // If we have the member cached, return that directly
    if (guild.members.has(userId) && !fresh) {
        return guild.members.get(userId) || null;
    }
    // We don't want to spam the API by trying to fetch unknown members again and again,
    // so we cache the fact that they're "unknown" for a while
    const unknownKey = `${guild.id}-${userId}`;
    if (unknownMembers.has(unknownKey)) {
        return null;
    }
    const freshMember = await bot.getRESTGuildMember(guild.id, userId).catch(noop);
    if (freshMember) {
        freshMember.id = userId;
        return freshMember;
    }
    unknownMembers.add(unknownKey);
    setTimeout(() => unknownMembers.delete(unknownKey), 15 * exports.MINUTES);
    return null;
}
exports.resolveMember = resolveMember;
/**
 * Resolves a role from the passed role ID, role mention, or role name.
 * In the event of duplicate role names, this function will return the first one it comes across.
 *
 * FIXME: Define "first one it comes across" better
 */
async function resolveRoleId(bot, guildId, value) {
    if (value == null) {
        return null;
    }
    // Role mention
    const mentionMatch = value.match(/^<@&?(\d+)>$/);
    if (mentionMatch) {
        return mentionMatch[1];
    }
    // Role name
    const roleList = await bot.getRESTGuildRoles(guildId);
    const role = roleList.filter(x => x.name.toLocaleLowerCase() === value.toLocaleLowerCase());
    if (role[0]) {
        return role[0].id;
    }
    // Role ID
    const idMatch = value.match(/^\d+$/);
    if (idMatch) {
        return value;
    }
    return null;
}
exports.resolveRoleId = resolveRoleId;
const inviteCache = new SimpleCache_1.SimpleCache(10 * exports.MINUTES, 200);
async function resolveInvite(client, code, withCounts) {
    const key = `${code}:${withCounts ? 1 : 0}`;
    if (inviteCache.has(key)) {
        return inviteCache.get(key);
    }
    // @ts-ignore: the getInvite() withCounts typings are blergh
    const promise = client.getInvite(code, withCounts).catch(() => null);
    inviteCache.set(key, promise);
    return promise;
}
exports.resolveInvite = resolveInvite;
async function confirm(bot, channel, userId, content) {
    const msg = await channel.createMessage(content);
    const reply = await knub_1.helpers.waitForReaction(bot, msg, ["✅", "❌"], userId);
    msg.delete().catch(noop);
    return reply && reply.name === "✅";
}
exports.confirm = confirm;
function messageSummary(msg) {
    // Regular text content
    let result = "```\n" + (msg.data.content ? disableCodeBlocks(msg.data.content) : "<no text content>") + "```";
    // Rich embed
    const richEmbed = (msg.data.embeds || []).find(e => e.type === "rich");
    if (richEmbed)
        result += "Embed:```" + disableCodeBlocks(JSON.stringify(richEmbed)) + "```";
    // Attachments
    if (msg.data.attachments) {
        result +=
            "Attachments:\n" + msg.data.attachments.map((a) => disableLinkPreviews(a.url)).join("\n") + "\n";
    }
    return result;
}
exports.messageSummary = messageSummary;
function verboseUserMention(user) {
    if (user.id == null) {
        return `**${user.username}#${user.discriminator}**`;
    }
    return `<@!${user.id}> (**${user.username}#${user.discriminator}**, \`${user.id}\`)`;
}
exports.verboseUserMention = verboseUserMention;
function verboseUserName(user) {
    if (user.id == null) {
        return `**${user.username}#${user.discriminator}**`;
    }
    return `**${user.username}#${user.discriminator}** (\`${user.id}\`)`;
}
exports.verboseUserName = verboseUserName;
function verboseChannelMention(channel) {
    const plainTextName = channel.type === eris_1.Constants.ChannelTypes.GUILD_VOICE || channel.type === eris_1.Constants.ChannelTypes.GUILD_STAGE
        ? channel.name
        : `#${channel.name}`;
    return `<#${channel.id}> (**${plainTextName}**, \`${channel.id}\`)`;
}
exports.verboseChannelMention = verboseChannelMention;
function messageLink(guildIdOrMessage, channelId, messageId) {
    let guildId;
    if (guildIdOrMessage == null) {
        // Full arguments without a guild id -> DM/Group chat
        guildId = "@me";
    }
    else if (guildIdOrMessage instanceof eris_1.Message) {
        // Message object as the only argument
        guildId = guildIdOrMessage.channel.guild?.id ?? "@me";
        channelId = guildIdOrMessage.channel.id;
        messageId = guildIdOrMessage.id;
    }
    else {
        // Full arguments with all IDs
        guildId = guildIdOrMessage;
    }
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}
exports.messageLink = messageLink;
function isValidEmbed(embed) {
    const result = validatorUtils_1.decodeAndValidateStrict(exports.tEmbed, embed);
    return !(result instanceof validatorUtils_1.StrictValidationError);
}
exports.isValidEmbed = isValidEmbed;
const formatter = new Intl.NumberFormat("en-US");
function formatNumber(numberToFormat) {
    return formatter.format(numberToFormat);
}
exports.formatNumber = formatNumber;
const memoizeCache = new Map();
function memoize(fn, key, time) {
    const realKey = key ?? fn;
    if (memoizeCache.has(realKey)) {
        const memoizedItem = memoizeCache.get(realKey);
        if (!time || memoizedItem.createdAt > Date.now() - time) {
            return memoizedItem.value;
        }
        memoizeCache.delete(realKey);
    }
    const value = fn();
    memoizeCache.set(realKey, {
        createdAt: Date.now(),
        value,
    });
    return value;
}
exports.memoize = memoize;
async function renderRecursively(value, fn) {
    if (Array.isArray(value)) {
        const result = [];
        for (const item of value) {
            result.push(await renderRecursively(item, fn));
        }
        return result;
    }
    else if (value === null) {
        return null;
    }
    else if (typeof value === "object") {
        const result = {};
        for (const [prop, _value] of Object.entries(value)) {
            result[prop] = await renderRecursively(_value, fn);
        }
        return result;
    }
    else if (typeof value === "string") {
        return fn(value);
    }
    return value;
}
exports.renderRecursively = renderRecursively;
function isValidEmoji(emoji) {
    return isUnicodeEmoji(emoji) || isSnowflake(emoji);
}
exports.isValidEmoji = isValidEmoji;
function canUseEmoji(client, emoji) {
    if (isUnicodeEmoji(emoji)) {
        return true;
    }
    else if (isSnowflake(emoji)) {
        for (const guild of client.guilds.values()) {
            if (guild.emojis.some(e => e.id === emoji)) {
                return true;
            }
        }
    }
    else {
        throw new Error(`Invalid emoji ${emoji}`);
    }
    return false;
}
exports.canUseEmoji = canUseEmoji;
/**
 * Trims any empty lines from the beginning and end of the given string
 * and indents matching the first line's indent
 */
function trimMultilineString(str) {
    const emptyLinesTrimmed = trimEmptyStartEndLines(str);
    const lines = emptyLinesTrimmed.split("\n");
    const firstLineIndentation = (lines[0].match(/^ +/g) || [""])[0].length;
    return trimIndents(emptyLinesTrimmed, firstLineIndentation);
}
exports.trimMultilineString = trimMultilineString;
exports.trimPluginDescription = trimMultilineString;
function isFullMessage(msg) {
    return msg.createdAt != null;
}
exports.isFullMessage = isFullMessage;
function isGuildInvite(invite) {
    return invite.guild != null;
}
exports.isGuildInvite = isGuildInvite;
function isGroupDMInvite(invite) {
    return invite.guild == null && invite.channel?.type === eris_1.Constants.ChannelTypes.GROUP_DM;
}
exports.isGroupDMInvite = isGroupDMInvite;
function inviteHasCounts(invite) {
    return invite.memberCount != null;
}
exports.inviteHasCounts = inviteHasCounts;
function asyncMap(arr, fn) {
    return Promise.all(arr.map((item, index) => fn(item)));
}
exports.asyncMap = asyncMap;
function unique(arr) {
    return Array.from(new Set(arr));
}
exports.unique = unique;
exports.DBDateFormat = "YYYY-MM-DD HH:mm:ss";
