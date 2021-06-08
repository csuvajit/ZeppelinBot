"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutomod = void 0;
const availableTriggers_1 = require("../triggers/availableTriggers");
const availableActions_1 = require("../actions/availableActions");
const clean_1 = require("../actions/clean");
const checkAndUpdateCooldown_1 = require("./checkAndUpdateCooldown");
async function runAutomod(pluginData, context) {
    const userId = context.user?.id || context.member?.id || context.message?.user_id;
    const user = context.user || (userId && pluginData.client.users.get(userId));
    const member = context.member || (userId && pluginData.guild.members.get(userId)) || null;
    const channelId = context.message?.channel_id;
    const channel = channelId ? pluginData.guild.channels.get(channelId) : null;
    const categoryId = channel?.parentID;
    const config = await pluginData.config.getMatchingConfig({
        channelId,
        categoryId,
        userId,
        member,
    });
    for (const [ruleName, rule] of Object.entries(config.rules)) {
        if (rule.enabled === false)
            continue;
        if (!rule.affects_bots && (!user || user.bot) && !context.counterTrigger && !context.antiraid)
            continue;
        if (rule.cooldown && checkAndUpdateCooldown_1.checkAndUpdateCooldown(pluginData, rule, context)) {
            continue;
        }
        let matchResult;
        let contexts = [];
        triggerLoop: for (const triggerItem of rule.triggers) {
            for (const [triggerName, triggerConfig] of Object.entries(triggerItem)) {
                const trigger = availableTriggers_1.availableTriggers[triggerName];
                matchResult = await trigger.match({
                    ruleName,
                    pluginData,
                    context,
                    triggerConfig,
                });
                if (matchResult) {
                    contexts = [context, ...(matchResult.extraContexts || [])];
                    for (const _context of contexts) {
                        _context.actioned = true;
                    }
                    if (matchResult.silentClean) {
                        await clean_1.CleanAction.apply({
                            ruleName,
                            pluginData,
                            contexts,
                            actionConfig: true,
                            matchResult,
                        });
                        return;
                    }
                    matchResult.summary =
                        (await trigger.renderMatchInformation({
                            ruleName,
                            pluginData,
                            contexts,
                            matchResult,
                            triggerConfig,
                        })) ?? "";
                    matchResult.fullSummary = `Triggered automod rule **${ruleName}**\n${matchResult.summary}`.trim();
                    break triggerLoop;
                }
            }
        }
        if (matchResult) {
            for (const [actionName, actionConfig] of Object.entries(rule.actions)) {
                if (actionConfig == null || actionConfig === false) {
                    continue;
                }
                const action = availableActions_1.availableActions[actionName];
                action.apply({
                    ruleName,
                    pluginData,
                    contexts,
                    actionConfig,
                    matchResult,
                });
            }
            break;
        }
    }
}
exports.runAutomod = runAutomod;
