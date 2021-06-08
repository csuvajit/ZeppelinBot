"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTagFromString = void 0;
const utils_1 = require("../../../utils");
const knub_command_manager_1 = require("knub-command-manager");
const templateFormatter_1 = require("../../../templateFormatter");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const renderTagBody_1 = require("./renderTagBody");
async function renderTagFromString(pluginData, str, prefix, tagName, tagBody, member) {
    const variableStr = str.slice(prefix.length + tagName.length).trim();
    const tagArgs = knub_command_manager_1.parseArguments(variableStr).map(v => v.value);
    // Format the string
    try {
        return renderTagBody_1.renderTagBody(pluginData, tagBody, tagArgs, {
            member: utils_1.stripObjectToScalars(member, ["user"]),
            user: utils_1.stripObjectToScalars(member.user),
        }, { member });
    }
    catch (e) {
        if (e instanceof templateFormatter_1.TemplateParseError) {
            const logs = pluginData.getPlugin(LogsPlugin_1.LogsPlugin);
            logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Failed to render tag \`${prefix}${tagName}\`: ${e.message}`,
            });
            return null;
        }
        throw e;
    }
}
exports.renderTagFromString = renderTagFromString;
