"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogMessage = void 0;
const types_1 = require("../types");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
const templateFormatter_1 = require("../../../templateFormatter");
const logger_1 = require("../../../logger");
const TimeAndDatePlugin_1 = require("../../TimeAndDate/TimeAndDatePlugin");
async function getLogMessage(pluginData, type, data, opts) {
    const config = pluginData.config.get();
    const format = opts?.format?.[LogType_1.LogType[type]] || config.format[LogType_1.LogType[type]] || "";
    if (format === "" || format == null)
        return null;
    // See comment on FORMAT_NO_TIMESTAMP in types.ts
    const timestampFormat = opts?.timestamp_format ??
        (config.format.timestamp !== types_1.FORMAT_NO_TIMESTAMP ? config.format.timestamp : null) ??
        config.timestamp_format;
    const includeEmbedTimestamp = opts?.include_embed_timestamp ?? config.include_embed_timestamp;
    const time = pluginData.getPlugin(TimeAndDatePlugin_1.TimeAndDatePlugin).inGuildTz();
    const isoTimestamp = time.toISOString();
    const timestamp = timestampFormat ? time.format(timestampFormat) : "";
    const values = {
        ...data,
        timestamp,
        userMention: async (inputUserOrMember) => {
            if (!inputUserOrMember)
                return "";
            const usersOrMembers = Array.isArray(inputUserOrMember) ? inputUserOrMember : [inputUserOrMember];
            const mentions = [];
            for (const userOrMember of usersOrMembers) {
                let user;
                let member;
                if (userOrMember.user) {
                    member = userOrMember;
                    user = member.user;
                }
                else {
                    user = userOrMember;
                    member = await utils_1.resolveMember(pluginData.client, pluginData.guild, user.id);
                }
                const memberConfig = (await pluginData.config.getMatchingConfig({ member, userId: user.id })) || {};
                // Revert to old behavior (verbose name w/o ping if allow_user_mentions is enabled (for whatever reason))
                if (config.allow_user_mentions) {
                    mentions.push(memberConfig.ping_user ? utils_1.verboseUserMention(user) : utils_1.verboseUserName(user));
                }
                else {
                    mentions.push(utils_1.verboseUserMention(user));
                }
            }
            return mentions.join(", ");
        },
        channelMention: channel => {
            if (!channel)
                return "";
            return utils_1.verboseChannelMention(channel);
        },
        messageSummary: (msg) => {
            if (!msg)
                return "";
            return utils_1.messageSummary(msg);
        },
    };
    if (type === LogType_1.LogType.BOT_ALERT) {
        const valuesWithoutTmplEval = { ...values };
        values.tmplEval = str => {
            return templateFormatter_1.renderTemplate(str, valuesWithoutTmplEval);
        };
    }
    const renderLogString = str => templateFormatter_1.renderTemplate(str, values);
    let formatted;
    try {
        formatted =
            typeof format === "string" ? await renderLogString(format) : await utils_1.renderRecursively(format, renderLogString);
    }
    catch (e) {
        if (e instanceof templateFormatter_1.TemplateParseError) {
            logger_1.logger.error(`Error when parsing template:\nError: ${e.message}\nTemplate: ${format}`);
            return null;
        }
        else {
            throw e;
        }
    }
    if (typeof formatted === "string") {
        formatted = formatted.trim();
        if (timestamp) {
            formatted = `\`[${timestamp}]\` ${formatted}`;
        }
    }
    else if (formatted != null && formatted.embed && includeEmbedTimestamp) {
        formatted.embed.timestamp = isoTimestamp;
    }
    return formatted;
}
exports.getLogMessage = getLogMessage;
