"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildArchives_1 = require("../../data/GuildArchives");
const GuildTags_1 = require("../../data/GuildTags");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildLogs_1 = require("../../data/GuildLogs");
const onMessageCreate_1 = require("./util/onMessageCreate");
const onMessageDelete_1 = require("./util/onMessageDelete");
const TagCreateCmd_1 = require("./commands/TagCreateCmd");
const TagDeleteCmd_1 = require("./commands/TagDeleteCmd");
const TagEvalCmd_1 = require("./commands/TagEvalCmd");
const TagListCmd_1 = require("./commands/TagListCmd");
const TagSourceCmd_1 = require("./commands/TagSourceCmd");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const utils_1 = require("../../utils");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const pluginUtils_1 = require("../../pluginUtils");
const renderTagBody_1 = require("./util/renderTagBody");
const findTagByName_1 = require("./util/findTagByName");
const validatorUtils_1 = require("src/validatorUtils");
const defaultOptions = {
    config: {
        prefix: "!!",
        delete_with_command: true,
        user_tag_cooldown: null,
        global_tag_cooldown: null,
        user_cooldown: null,
        allow_mentions: false,
        global_cooldown: null,
        auto_delete_command: false,
        categories: {},
        can_create: false,
        can_use: false,
        can_list: false,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_use: true,
                can_create: true,
                can_list: true,
            },
        },
    ],
};
exports.TagsPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "tags",
    showInDocs: true,
    info: {
        prettyName: "Tags",
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        TagEvalCmd_1.TagEvalCmd,
        TagDeleteCmd_1.TagDeleteCmd,
        TagListCmd_1.TagListCmd,
        TagSourceCmd_1.TagSourceCmd,
        TagCreateCmd_1.TagCreateCmd,
    ],
    public: {
        renderTagBody: pluginUtils_1.mapToPublicFn(renderTagBody_1.renderTagBody),
        findTagByName: pluginUtils_1.mapToPublicFn(findTagByName_1.findTagByName),
    },
    configPreprocessor(options) {
        if (options.config.delete_with_command && options.config.auto_delete_command) {
            throw new validatorUtils_1.StrictValidationError([
                `Cannot have both (global) delete_with_command and global_delete_invoke enabled`,
            ]);
        }
        // Check each category for conflicting options
        if (options.config?.categories) {
            for (const [name, opts] of Object.entries(options.config.categories)) {
                const cat = options.config.categories[name];
                if (cat.delete_with_command && cat.auto_delete_command) {
                    throw new validatorUtils_1.StrictValidationError([
                        `Cannot have both (category specific) delete_with_command and category_delete_invoke enabled at <categories/${name}>`,
                    ]);
                }
            }
        }
        return options;
    },
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.archives = GuildArchives_1.GuildArchives.getGuildInstance(guild.id);
        state.tags = GuildTags_1.GuildTags.getGuildInstance(guild.id);
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
        state.tagFunctions = {};
    },
    afterLoad(pluginData) {
        const { state, guild } = pluginData;
        state.onMessageCreateFn = msg => onMessageCreate_1.onMessageCreate(pluginData, msg);
        state.savedMessages.events.on("create", state.onMessageCreateFn);
        state.onMessageDeleteFn = msg => onMessageDelete_1.onMessageDelete(pluginData, msg);
        state.savedMessages.events.on("delete", state.onMessageDeleteFn);
        const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin);
        const tz = timeAndDate.getGuildTz();
        state.tagFunctions = {
            parseDateTime(str) {
                if (typeof str === "number") {
                    return str; // Unix timestamp
                }
                if (typeof str !== "string") {
                    return Date.now();
                }
                return moment_timezone_1.default.tz(str, "YYYY-MM-DD HH:mm:ss", tz).valueOf();
            },
            countdown(toDate) {
                const target = moment_timezone_1.default.utc(this.parseDateTime(toDate), "x");
                const now = moment_timezone_1.default.utc();
                if (!target.isValid())
                    return "";
                const diff = target.diff(now);
                const result = humanize_duration_1.default(diff, { largest: 2, round: true });
                return diff >= 0 ? result : `${result} ago`;
            },
            now() {
                return Date.now();
            },
            timeAdd(...args) {
                let reference;
                let delay;
                if (args.length >= 2) {
                    // (time, delay)
                    reference = this.parseDateTime(args[0]);
                    delay = args[1];
                }
                else {
                    // (delay), implicit "now" as time
                    reference = Date.now();
                    delay = args[0];
                }
                const delayMS = utils_1.convertDelayStringToMS(delay) ?? 0;
                return moment_timezone_1.default
                    .utc(reference, "x")
                    .add(delayMS)
                    .valueOf();
            },
            timeSub(...args) {
                let reference;
                let delay;
                if (args.length >= 2) {
                    // (time, delay)
                    reference = this.parseDateTime(args[0]);
                    delay = args[1];
                }
                else {
                    // (delay), implicit "now" as time
                    reference = Date.now();
                    delay = args[0];
                }
                const delayMS = utils_1.convertDelayStringToMS(delay) ?? 0;
                return moment_timezone_1.default
                    .utc(reference, "x")
                    .subtract(delayMS)
                    .valueOf();
            },
            timeAgo(delay) {
                return this.timeSub(delay);
            },
            formatTime(time, format) {
                const parsed = this.parseDateTime(time);
                return timeAndDate.inGuildTz(parsed).format(format);
            },
            discordDateFormat(time) {
                const parsed = time ? this.parseDateTime(time) : Date.now();
                return timeAndDate.inGuildTz(parsed).format("YYYY-MM-DD");
            },
            mention: input => {
                if (typeof input !== "string") {
                    return "";
                }
                if (input.match(/^<(?:@[!&]?|#)\d+>$/)) {
                    return input;
                }
                if (pluginData.guild.members.has(input) || pluginData.client.users.has(input)) {
                    return `<@!${input}>`;
                }
                if (pluginData.guild.channels.has(input) || pluginData.client.channelGuildMap[input]) {
                    return `<#${input}>`;
                }
                return "";
            },
            isMention: input => {
                if (typeof input !== "string") {
                    return false;
                }
                return /^<(?:@[!&]?|#)\d+>$/.test(input);
            },
        };
        for (const [name, fn] of Object.entries(state.tagFunctions)) {
            state.tagFunctions[name] = fn.bind(state.tagFunctions);
        }
    },
    beforeUnload(pluginData) {
        pluginData.state.savedMessages.events.off("create", pluginData.state.onMessageCreateFn);
        pluginData.state.savedMessages.events.off("delete", pluginData.state.onMessageDeleteFn);
    },
});
