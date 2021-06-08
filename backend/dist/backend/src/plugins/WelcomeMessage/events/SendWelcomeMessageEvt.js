"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendWelcomeMessageEvt = void 0;
const types_1 = require("../types");
const templateFormatter_1 = require("../../../templateFormatter");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const eris_1 = require("eris");
const sendDM_1 = require("../../../utils/sendDM");
exports.SendWelcomeMessageEvt = types_1.welcomeMessageEvt({
    event: "guildMemberAdd",
    async listener(meta) {
        const pluginData = meta.pluginData;
        const member = meta.args.member;
        const config = pluginData.config.get();
        if (!config.message)
            return;
        if (!config.send_dm && !config.send_to_channel)
            return;
        // Only send welcome messages once per user (even if they rejoin) until the plugin is reloaded
        if (pluginData.state.sentWelcomeMessages.has(member.id)) {
            return;
        }
        pluginData.state.sentWelcomeMessages.add(member.id);
        let formatted;
        try {
            const strippedMember = utils_1.stripObjectToScalars(member, ["user", "guild"]);
            formatted = await templateFormatter_1.renderTemplate(config.message, {
                member: strippedMember,
                user: strippedMember["user"],
                guild: strippedMember["guild"],
            });
        }
        catch (e) {
            if (e instanceof templateFormatter_1.TemplateParseError) {
                pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Error formatting welcome message: ${e.message}`,
                });
                return;
            }
            throw e;
        }
        if (config.send_dm) {
            try {
                await sendDM_1.sendDM(member.user, formatted, "welcome message");
            }
            catch {
                pluginData.state.logs.log(LogType_1.LogType.DM_FAILED, {
                    source: "welcome message",
                    user: utils_1.stripObjectToScalars(member.user),
                });
            }
        }
        if (config.send_to_channel) {
            const channel = meta.args.guild.channels.get(config.send_to_channel);
            if (!channel || !(channel instanceof eris_1.TextChannel))
                return;
            try {
                await utils_1.createChunkedMessage(channel, formatted);
            }
            catch {
                pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                    body: `Failed send a welcome message for {userMention(member)} to {channelMention(channel)}`,
                    member: utils_1.stripObjectToScalars(member),
                    channel: utils_1.stripObjectToScalars(channel),
                });
            }
        }
    },
});
