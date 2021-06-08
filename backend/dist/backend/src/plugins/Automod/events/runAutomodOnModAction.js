"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutomodOnModAction = void 0;
const runAutomod_1 = require("../functions/runAutomod");
const utils_1 = require("../../../utils");
async function runAutomodOnModAction(pluginData, modAction, userId, reason, isAutomodAction = false) {
    const [user, member] = await Promise.all([
        utils_1.resolveUser(pluginData.client, userId),
        utils_1.resolveMember(pluginData.client, pluginData.guild, userId),
    ]);
    const context = {
        timestamp: Date.now(),
        user: user instanceof utils_1.UnknownUser ? undefined : user,
        member: member ?? undefined,
        modAction: {
            type: modAction,
            reason,
            isAutomodAction,
        },
    };
    pluginData.state.queue.add(async () => {
        await runAutomod_1.runAutomod(pluginData, context);
    });
}
exports.runAutomodOnModAction = runAutomodOnModAction;
