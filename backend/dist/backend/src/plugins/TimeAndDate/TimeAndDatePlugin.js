"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeAndDatePlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildMemberTimezones_1 = require("../../data/GuildMemberTimezones");
const SetTimezoneCmd_1 = require("./commands/SetTimezoneCmd");
const ViewTimezoneCmd_1 = require("./commands/ViewTimezoneCmd");
const defaultDateFormats_1 = require("./defaultDateFormats");
const inGuildTz_1 = require("./functions/inGuildTz");
const pluginUtils_1 = require("../../pluginUtils");
const getGuildTz_1 = require("./functions/getGuildTz");
const getMemberTz_1 = require("./functions/getMemberTz");
const getDateFormat_1 = require("./functions/getDateFormat");
const inMemberTz_1 = require("./functions/inMemberTz");
const ResetTimezoneCmd_1 = require("./commands/ResetTimezoneCmd");
const utils_1 = require("../../utils");
const defaultOptions = {
    config: {
        timezone: "Etc/UTC",
        can_set_timezone: false,
        date_formats: defaultDateFormats_1.defaultDateFormats,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_set_timezone: true,
            },
        },
    ],
};
exports.TimeAndDatePlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "time_and_date",
    showInDocs: true,
    info: {
        prettyName: "Time and date",
        description: utils_1.trimPluginDescription(`
      Allows controlling the displayed time/date formats and timezones
    `),
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        ResetTimezoneCmd_1.ResetTimezoneCmd,
        SetTimezoneCmd_1.SetTimezoneCmd,
        ViewTimezoneCmd_1.ViewTimezoneCmd,
    ],
    public: {
        getGuildTz: pluginUtils_1.mapToPublicFn(getGuildTz_1.getGuildTz),
        inGuildTz: pluginUtils_1.mapToPublicFn(inGuildTz_1.inGuildTz),
        getMemberTz: pluginUtils_1.mapToPublicFn(getMemberTz_1.getMemberTz),
        inMemberTz: pluginUtils_1.mapToPublicFn(inMemberTz_1.inMemberTz),
        getDateFormat: pluginUtils_1.mapToPublicFn(getDateFormat_1.getDateFormat),
    },
    beforeLoad(pluginData) {
        pluginData.state.memberTimezones = GuildMemberTimezones_1.GuildMemberTimezones.getGuildInstance(pluginData.guild.id);
    },
});
