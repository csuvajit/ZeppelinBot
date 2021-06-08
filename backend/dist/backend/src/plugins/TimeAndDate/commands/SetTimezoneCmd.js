"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetTimezoneCmd = void 0;
const types_1 = require("../types");
const commandTypes_1 = require("../../../commandTypes");
const pluginUtils_1 = require("../../../pluginUtils");
const utils_1 = require("../../../utils");
const parseFuzzyTimezone_1 = require("../../../utils/parseFuzzyTimezone");
exports.SetTimezoneCmd = types_1.timeAndDateCmd({
    trigger: "timezone",
    permission: "can_set_timezone",
    signature: {
        timezone: commandTypes_1.commandTypeHelpers.string(),
    },
    async run({ pluginData, message, args }) {
        const parsedTz = parseFuzzyTimezone_1.parseFuzzyTimezone(args.timezone);
        if (!parsedTz) {
            pluginUtils_1.sendErrorMessage(pluginData, message.channel, utils_1.trimLines(`
        Invalid timezone: \`${utils_1.disableInlineCode(args.timezone)}\`
        Zeppelin uses timezone locations rather than specific timezone names.
        See the **TZ database name** column at <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones> for a list of valid options.
      `));
            return;
        }
        await pluginData.state.memberTimezones.set(message.author.id, parsedTz);
        pluginUtils_1.sendSuccessMessage(pluginData, message.channel, `Your timezone is now set to **${parsedTz}**`);
    },
});
