"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./loadEnv");
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const knub_1 = require("knub");
const SimpleError_1 = require("./SimpleError");
const Configs_1 = require("./data/Configs");
// Always use UTC internally
// This is also enforced for the database in data/db.ts
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const eris_1 = require("eris");
const db_1 = require("./data/db");
const availablePlugins_1 = require("./plugins/availablePlugins");
const utils_1 = require("./utils");
const uptime_1 = require("./uptime");
const AllowedGuilds_1 = require("./data/AllowedGuilds");
const RecoverablePluginError_1 = require("./RecoverablePluginError");
const GuildLogs_1 = require("./data/GuildLogs");
const LogType_1 = require("./data/LogType");
const logger_1 = require("./logger");
const PluginLoadError_1 = require("knub/dist/plugins/PluginLoadError");
const ErisError_1 = require("./ErisError");
const fsp = fs_1.default.promises;
if (!process.env.KEY) {
    // tslint:disable-next-line:no-console
    console.error("Project root .env with KEY is required!");
    process.exit(1);
}
// Error handling
let recentPluginErrors = 0;
const RECENT_PLUGIN_ERROR_EXIT_THRESHOLD = 5;
let recentDiscordErrors = 0;
const RECENT_DISCORD_ERROR_EXIT_THRESHOLD = 5;
setInterval(() => (recentPluginErrors = Math.max(0, recentPluginErrors - 1)), 2000);
setInterval(() => (recentDiscordErrors = Math.max(0, recentDiscordErrors - 1)), 2000);
// Eris handles these internally, so we don't need to panic if we get one of them
const SAFE_TO_IGNORE_ERIS_ERROR_CODES = [
    1001,
    1006,
    "ECONNRESET",
];
const SAFE_TO_IGNORE_ERIS_ERROR_MESSAGES = ["Server didn't acknowledge previous heartbeat, possible lost connection"];
function errorHandler(err) {
    const guildName = err.guild?.name || "Global";
    const guildId = err.guild?.id || "0";
    if (err instanceof RecoverablePluginError_1.RecoverablePluginError) {
        // Recoverable plugin errors can be, well, recovered from.
        // Log it in the console as a warning and post a warning to the guild's log.
        // tslint:disable:no-console
        console.warn(`${guildName}: [${err.code}] ${err.message}`);
        if (err.guild) {
            const logs = new GuildLogs_1.GuildLogs(err.guild.id);
            logs.log(LogType_1.LogType.BOT_ALERT, { body: `\`[${err.code}]\` ${err.message}` });
        }
        return;
    }
    if (err instanceof PluginLoadError_1.PluginLoadError) {
        // tslint:disable:no-console
        console.warn(`${guildName} (${guildId}): Failed to load plugin '${err.pluginName}': ${err.message}`);
        return;
    }
    if (err instanceof ErisError_1.ErisError) {
        if (err.code && SAFE_TO_IGNORE_ERIS_ERROR_CODES.includes(err.code)) {
            return;
        }
        if (err.message && SAFE_TO_IGNORE_ERIS_ERROR_MESSAGES.includes(err.message)) {
            return;
        }
    }
    if (err instanceof eris_1.DiscordHTTPError && err.code >= 500) {
        // Don't need stack traces on HTTP 500 errors
        // These also shouldn't count towards RECENT_DISCORD_ERROR_EXIT_THRESHOLD because they don't indicate an error in our code
        console.error(err.message);
        return;
    }
    if (err.message && err.message.startsWith("Request timed out")) {
        // These are very noisy, so just print the message without stack. The stack trace doesn't really help here anyway.
        console.error(err.message);
        return;
    }
    // tslint:disable:no-console
    console.error(err);
    if (err instanceof knub_1.PluginError) {
        // Tolerate a few recent plugin errors before crashing
        if (++recentPluginErrors >= RECENT_PLUGIN_ERROR_EXIT_THRESHOLD) {
            console.error(`Exiting after ${RECENT_PLUGIN_ERROR_EXIT_THRESHOLD} plugin errors`);
            process.exit(1);
        }
    }
    else if (utils_1.isDiscordRESTError(err) || utils_1.isDiscordHTTPError(err)) {
        // Discord API errors, usually safe to just log instead of crash
        // We still bail if we get a ton of them in a short amount of time
        if (++recentDiscordErrors >= RECENT_DISCORD_ERROR_EXIT_THRESHOLD) {
            console.error(`Exiting after ${RECENT_DISCORD_ERROR_EXIT_THRESHOLD} API errors`);
            process.exit(1);
        }
    }
    else {
        // On other errors, crash immediately
        process.exit(1);
    }
    // tslint:enable:no-console
}
if (process.env.NODE_ENV === "production") {
    process.on("uncaughtException", errorHandler);
    process.on("unhandledRejection", errorHandler);
}
// Verify required Node.js version
const REQUIRED_NODE_VERSION = "14.0.0";
const requiredParts = REQUIRED_NODE_VERSION.split(".").map(v => parseInt(v, 10));
const actualVersionParts = process.versions.node.split(".").map(v => parseInt(v, 10));
for (const [i, part] of actualVersionParts.entries()) {
    if (part > requiredParts[i])
        break;
    if (part === requiredParts[i])
        continue;
    throw new SimpleError_1.SimpleError(`Unsupported Node.js version! Must be at least ${REQUIRED_NODE_VERSION}`);
}
moment_timezone_1.default.tz.setDefault("UTC");
logger_1.logger.info("Connecting to database");
db_1.connect().then(async () => {
    const client = new eris_1.Client(`Bot ${process.env.TOKEN}`, {
        getAllUsers: false,
        restMode: true,
        compress: false,
        guildCreateTimeout: 0,
        rest: {
            ratelimiterOffset: 150,
        },
        // Disable mentions by default
        allowedMentions: {
            everyone: false,
            users: false,
            roles: false,
            repliedUser: false,
        },
        intents: [
            // Privileged
            "guildMembers",
            // "guildPresences",
            "guildMessageTyping",
            // Regular
            "directMessages",
            "guildBans",
            "guildEmojis",
            "guildInvites",
            "guildMessageReactions",
            "guildMessages",
            "guilds",
            "guildVoiceStates",
        ],
    });
    client.setMaxListeners(200);
    client.on("debug", message => {
        if (message.includes(" 429 ")) {
            logger_1.logger.info(`[429] ${message}`);
        }
    });
    client.on("error", (err, shardId) => {
        errorHandler(new ErisError_1.ErisError(err.message, err.code, shardId));
    });
    const allowedGuilds = new AllowedGuilds_1.AllowedGuilds();
    const guildConfigs = new Configs_1.Configs();
    const bot = new knub_1.Knub(client, {
        guildPlugins: availablePlugins_1.guildPlugins,
        globalPlugins: availablePlugins_1.globalPlugins,
        options: {
            canLoadGuild(guildId) {
                return allowedGuilds.isAllowed(guildId);
            },
            /**
             * Plugins are enabled if they...
             * - are base plugins, i.e. always enabled, or
             * - are explicitly enabled in the guild config
             * Dependencies are also automatically loaded by Knub.
             */
            async getEnabledGuildPlugins(ctx, plugins) {
                if (!ctx.config || !ctx.config.plugins) {
                    return [];
                }
                const configuredPlugins = ctx.config.plugins;
                const basePluginNames = availablePlugins_1.baseGuildPlugins.map(p => p.name);
                return Array.from(plugins.keys()).filter(pluginName => {
                    if (basePluginNames.includes(pluginName))
                        return true;
                    return configuredPlugins[pluginName] && configuredPlugins[pluginName].enabled !== false;
                });
            },
            async getConfig(id) {
                const key = id === "global" ? "global" : `guild-${id}`;
                const row = await guildConfigs.getActiveByKey(key);
                if (row) {
                    return js_yaml_1.default.safeLoad(row.config);
                }
                logger_1.logger.warn(`No config with key "${key}"`);
                return {};
            },
            logFn: (level, msg) => {
                if (level === "debug")
                    return;
                if (logger_1.logger[level]) {
                    logger_1.logger[level](msg);
                }
                else {
                    logger_1.logger.log(`[${level.toUpperCase()}] ${msg}`);
                }
            },
            performanceDebug: {
                enabled: false,
                size: 30,
                threshold: 200,
            },
            sendSuccessMessageFn(channel, body) {
                const guildId = channel instanceof eris_1.TextChannel ? channel.guild.id : undefined;
                const emoji = guildId ? bot.getLoadedGuild(guildId).config.success_emoji : undefined;
                channel.createMessage(utils_1.successMessage(body, emoji));
            },
            sendErrorMessageFn(channel, body) {
                const guildId = channel instanceof eris_1.TextChannel ? channel.guild.id : undefined;
                const emoji = guildId ? bot.getLoadedGuild(guildId).config.error_emoji : undefined;
                channel.createMessage(utils_1.errorMessage(body, emoji));
            },
        },
    });
    client.once("ready", () => {
        uptime_1.startUptimeCounter();
    });
    logger_1.logger.info("Starting the bot");
    bot.run();
});
