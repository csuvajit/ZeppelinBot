"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunAutomodOnMemberUpdate = void 0;
const knub_1 = require("knub");
const runAutomod_1 = require("../functions/runAutomod");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const lodash_difference_1 = __importDefault(require("lodash.difference"));
exports.RunAutomodOnMemberUpdate = knub_1.typedGuildEventListener()({
    event: "guildMemberUpdate",
    listener({ pluginData, args: { member, oldMember } }) {
        if (!oldMember)
            return;
        if (lodash_isequal_1.default(oldMember.roles, member.roles))
            return;
        const addedRoles = lodash_difference_1.default(member.roles, oldMember.roles);
        const removedRoles = lodash_difference_1.default(oldMember.roles, member.roles);
        if (addedRoles.length || removedRoles.length) {
            const context = {
                timestamp: Date.now(),
                user: member.user,
                member,
                rolesChanged: {
                    added: addedRoles,
                    removed: removedRoles,
                },
            };
            pluginData.state.queue.add(() => {
                runAutomod_1.runAutomod(pluginData, context);
            });
        }
    },
});
