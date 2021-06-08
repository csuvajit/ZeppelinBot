"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCaseToCaseLogChannel = exports.postToCaseLogChannel = void 0;
const eris_1 = require("eris");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const getCaseEmbed_1 = require("./getCaseEmbed");
const resolveCaseId_1 = require("./resolveCaseId");
async function postToCaseLogChannel(pluginData, content, file) {
    const caseLogChannelId = pluginData.config.get().case_log_channel;
    if (!caseLogChannelId)
        return null;
    const caseLogChannel = pluginData.guild.channels.get(caseLogChannelId);
    if (!caseLogChannel || !(caseLogChannel instanceof eris_1.TextChannel))
        return null;
    let result;
    try {
        result = await caseLogChannel.createMessage(content, file);
    }
    catch (e) {
        if (utils_1.isDiscordRESTError(e) && (e.code === 50013 || e.code === 50001)) {
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Missing permissions to post mod cases in <#${caseLogChannel.id}>`,
            });
            return null;
        }
        throw e;
    }
    return result;
}
exports.postToCaseLogChannel = postToCaseLogChannel;
async function postCaseToCaseLogChannel(pluginData, caseOrCaseId) {
    const theCase = await pluginData.state.cases.find(resolveCaseId_1.resolveCaseId(caseOrCaseId));
    if (!theCase)
        return null;
    const caseEmbed = await getCaseEmbed_1.getCaseEmbed(pluginData, caseOrCaseId, undefined, true);
    if (!caseEmbed)
        return null;
    if (theCase.log_message_id) {
        const [channelId, messageId] = theCase.log_message_id.split("-");
        try {
            await pluginData.client.editMessage(channelId, messageId, caseEmbed);
            return null;
        }
        catch { } // tslint:disable-line:no-empty
    }
    try {
        const postedMessage = await postToCaseLogChannel(pluginData, caseEmbed);
        if (postedMessage) {
            await pluginData.state.cases.update(theCase.id, {
                log_message_id: `${postedMessage.channel.id}-${postedMessage.id}`,
            });
        }
        return postedMessage;
    }
    catch {
        pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
            body: `Failed to post case #${theCase.case_number} to the case log channel`,
        });
        return null;
    }
}
exports.postCaseToCaseLogChannel = postCaseToCaseLogChannel;
