"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunAutomodOnJoinEvt = void 0;
const knub_1 = require("knub");
const runAutomod_1 = require("../functions/runAutomod");
const constants_1 = require("../constants");
exports.RunAutomodOnJoinEvt = knub_1.typedGuildEventListener()({
    event: "guildMemberAdd",
    listener({ pluginData, args: { member } }) {
        const context = {
            timestamp: Date.now(),
            user: member.user,
            member,
            joined: true,
        };
        pluginData.state.queue.add(() => {
            pluginData.state.recentActions.push({
                type: constants_1.RecentActionType.MemberJoin,
                context,
                count: 1,
                identifier: null,
            });
            runAutomod_1.runAutomod(pluginData, context);
        });
    },
});
