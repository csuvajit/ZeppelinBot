"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const LogType_1 = require("../../../data/LogType");
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const getLogMessage_1 = require("./getLogMessage");
const RegExpRunner_1 = require("../../../RegExpRunner");
const SavedMessage_1 = require("../../../data/entities/SavedMessage");
const excludedUserProps = ["user", "member", "mod"];
const excludedRoleProps = ["message.member.roles", "member.roles"];
function isRoleArray(value) {
    return Array.isArray(value);
}
async function log(pluginData, type, data) {
    const logChannels = pluginData.config.get().channels;
    const typeStr = LogType_1.LogType[type];
    logChannelLoop: for (const [channelId, opts] of Object.entries(logChannels)) {
        const channel = pluginData.guild.channels.get(channelId);
        if (!channel || !(channel instanceof eris_1.TextChannel))
            continue;
        if ((opts.include && opts.include.includes(typeStr)) || (opts.exclude && !opts.exclude.includes(typeStr))) {
            // If this log entry is about an excluded user, skip it
            // TODO: Quick and dirty solution, look into changing at some point
            if (opts.excluded_users) {
                for (const prop of excludedUserProps) {
                    if (data && data[prop] && opts.excluded_users.includes(data[prop].id)) {
                        continue logChannelLoop;
                    }
                }
            }
            // If we're excluding bots and the logged user is a bot, skip it
            if (opts.exclude_bots) {
                for (const prop of excludedUserProps) {
                    if (data && data[prop] && data[prop].bot) {
                        continue logChannelLoop;
                    }
                }
            }
            if (opts.excluded_roles) {
                for (const value of Object.values(data || {})) {
                    if (value instanceof SavedMessage_1.SavedMessage) {
                        const member = pluginData.guild.members.get(value.user_id);
                        for (const role of member?.roles || []) {
                            if (opts.excluded_roles.includes(role)) {
                                continue logChannelLoop;
                            }
                        }
                    }
                }
                for (const prop of excludedRoleProps) {
                    const roles = utils_1.get(data, prop);
                    if (!isRoleArray(roles)) {
                        continue;
                    }
                    for (const role of roles) {
                        if (opts.excluded_roles.includes(role)) {
                            continue logChannelLoop;
                        }
                    }
                }
            }
            // If this entry is from an excluded channel, skip it
            if (opts.excluded_channels) {
                if (type === LogType_1.LogType.MESSAGE_DELETE ||
                    type === LogType_1.LogType.MESSAGE_DELETE_BARE ||
                    type === LogType_1.LogType.MESSAGE_EDIT ||
                    type === LogType_1.LogType.MESSAGE_SPAM_DETECTED ||
                    type === LogType_1.LogType.CENSOR ||
                    type === LogType_1.LogType.CLEAN) {
                    if (opts.excluded_channels.includes(data.channel.id)) {
                        continue logChannelLoop;
                    }
                }
            }
            // If this entry is from an excluded category, skip it
            if (opts.excluded_categories) {
                if (type === LogType_1.LogType.MESSAGE_DELETE ||
                    type === LogType_1.LogType.MESSAGE_DELETE_BARE ||
                    type === LogType_1.LogType.MESSAGE_EDIT ||
                    type === LogType_1.LogType.MESSAGE_SPAM_DETECTED ||
                    type === LogType_1.LogType.CENSOR ||
                    type === LogType_1.LogType.CLEAN) {
                    if (data.channel.parentID && opts.excluded_categories.includes(data.channel.parentID)) {
                        continue logChannelLoop;
                    }
                }
            }
            // If this entry contains a message with an excluded regex, skip it
            if (type === LogType_1.LogType.MESSAGE_DELETE && opts.excluded_message_regexes && data.message.data.content) {
                for (const regex of opts.excluded_message_regexes) {
                    const matches = await pluginData.state.regexRunner.exec(regex, data.message.data.content).catch(RegExpRunner_1.allowTimeout);
                    if (matches) {
                        continue logChannelLoop;
                    }
                }
            }
            if (type === LogType_1.LogType.MESSAGE_EDIT && opts.excluded_message_regexes && data.before.data.content) {
                for (const regex of opts.excluded_message_regexes) {
                    const matches = await pluginData.state.regexRunner.exec(regex, data.before.data.content).catch(RegExpRunner_1.allowTimeout);
                    if (matches) {
                        continue logChannelLoop;
                    }
                }
            }
            const message = await getLogMessage_1.getLogMessage(pluginData, type, data, {
                format: opts.format,
                include_embed_timestamp: opts.include_embed_timestamp,
                timestamp_format: opts.timestamp_format,
            });
            if (message) {
                // For non-string log messages (i.e. embeds) batching or chunking is not possible, so send them immediately
                if (typeof message !== "string") {
                    await channel.createMessage(message).catch(utils_1.noop);
                    return;
                }
                // Default to batched unless explicitly disabled
                const batched = opts.batched ?? true;
                const batchTime = opts.batch_time ?? 1000;
                const cfg = pluginData.config.get();
                if (batched) {
                    // If we're batching log messages, gather all log messages within the set batch_time into a single message
                    if (!pluginData.state.batches.has(channel.id)) {
                        pluginData.state.batches.set(channel.id, []);
                        setTimeout(async () => {
                            const batchedMessage = pluginData.state.batches.get(channel.id).join("\n");
                            pluginData.state.batches.delete(channel.id);
                            utils_1.createChunkedMessage(channel, batchedMessage, { users: cfg.allow_user_mentions }).catch(utils_1.noop);
                        }, batchTime);
                    }
                    pluginData.state.batches.get(channel.id).push(message);
                }
                else {
                    // If we're not batching log messages, just send them immediately
                    await utils_1.createChunkedMessage(channel, message, { users: cfg.allow_user_mentions }).catch(utils_1.noop);
                }
            }
        }
    }
}
exports.log = log;
