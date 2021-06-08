"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsGuildMemberAddEvt = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const LogType_1 = require("../../../data/LogType");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const CasesPlugin_1 = require("../../Cases/CasesPlugin");
exports.LogsGuildMemberAddEvt = types_1.logsEvt({
    event: "guildMemberAdd",
    async listener(meta) {
        const pluginData = meta.pluginData;
        const member = meta.args.member;
        const newThreshold = moment_timezone_1.default.utc().valueOf() - 1000 * 60 * 60;
        const accountAge = humanize_duration_1.default(moment_timezone_1.default.utc().valueOf() - member.createdAt, {
            largest: 2,
            round: true,
        });
        pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_JOIN, {
            member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
            new: member.createdAt >= newThreshold ? " :new:" : "",
            account_age: accountAge,
        });
        const cases = (await pluginData.state.cases.with("notes").getByUserId(member.id)).filter(c => !c.is_hidden);
        cases.sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
        if (cases.length) {
            const recentCaseLines = [];
            const recentCases = cases.slice(0, 2);
            const casesPlugin = pluginData.getPlugin(CasesPlugin_1.CasesPlugin);
            for (const theCase of recentCases) {
                recentCaseLines.push((await casesPlugin.getCaseSummary(theCase)));
            }
            let recentCaseSummary = recentCaseLines.join("\n");
            if (recentCases.length < cases.length) {
                const remaining = cases.length - recentCases.length;
                if (remaining === 1) {
                    recentCaseSummary += `\n*+${remaining} case*`;
                }
                else {
                    recentCaseSummary += `\n*+${remaining} cases*`;
                }
            }
            pluginData.state.guildLogs.log(LogType_1.LogType.MEMBER_JOIN_WITH_PRIOR_RECORDS, {
                member: utils_1.stripObjectToScalars(member, ["user", "roles"]),
                recentCaseSummary,
            });
        }
    },
});
