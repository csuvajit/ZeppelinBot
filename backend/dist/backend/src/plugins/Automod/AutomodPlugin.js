"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomodPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const RunAutomodOnJoinEvt_1 = require("./events/RunAutomodOnJoinEvt");
const GuildLogs_1 = require("../../data/GuildLogs");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const runAutomodOnMessage_1 = require("./events/runAutomodOnMessage");
const Queue_1 = require("../../Queue");
const knub_1 = require("knub");
const availableTriggers_1 = require("./triggers/availableTriggers");
const validatorUtils_1 = require("../../validatorUtils");
const availableActions_1 = require("./actions/availableActions");
const clearOldRecentActions_1 = require("./functions/clearOldRecentActions");
const utils_1 = require("../../utils");
const clearOldRecentSpam_1 = require("./functions/clearOldRecentSpam");
const GuildAntiraidLevels_1 = require("../../data/GuildAntiraidLevels");
const GuildArchives_1 = require("../../data/GuildArchives");
const clearOldNicknameChanges_1 = require("./functions/clearOldNicknameChanges");
const LogsPlugin_1 = require("../Logs/LogsPlugin");
const ModActionsPlugin_1 = require("../ModActions/ModActionsPlugin");
const MutesPlugin_1 = require("../Mutes/MutesPlugin");
const AntiraidClearCmd_1 = require("./commands/AntiraidClearCmd");
const SetAntiraidCmd_1 = require("./commands/SetAntiraidCmd");
const ViewAntiraidCmd_1 = require("./commands/ViewAntiraidCmd");
const info_1 = require("./info");
const regExpRunners_1 = require("../../regExpRunners");
const RunAutomodOnMemberUpdate_1 = require("./events/RunAutomodOnMemberUpdate");
const CountersPlugin_1 = require("../Counters/CountersPlugin");
const runAutomodOnCounterTrigger_1 = require("./events/runAutomodOnCounterTrigger");
const runAutomodOnModAction_1 = require("./events/runAutomodOnModAction");
const registerEventListenersFromMap_1 = require("../../utils/registerEventListenersFromMap");
const unregisterEventListenersFromMap_1 = require("../../utils/unregisterEventListenersFromMap");
const defaultOptions = {
    config: {
        rules: {},
        antiraid_levels: ["low", "medium", "high"],
        can_set_antiraid: false,
        can_view_antiraid: false,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_view_antiraid: true,
            },
        },
        {
            level: ">=100",
            config: {
                can_set_antiraid: true,
            },
        },
    ],
};
/**
 * Config preprocessor to set default values for triggers and perform extra validation
 */
const configPreprocessor = options => {
    if (options.config?.rules) {
        // Loop through each rule
        for (const [name, rule] of Object.entries(options.config.rules)) {
            if (rule == null) {
                delete options.config.rules[name];
                continue;
            }
            rule["name"] = name;
            // If the rule doesn't have an explicitly set "enabled" property, set it to true
            if (rule["enabled"] == null) {
                rule["enabled"] = true;
            }
            if (rule["affects_bots"] == null) {
                rule["affects_bots"] = false;
            }
            // Loop through the rule's triggers
            if (rule["triggers"]) {
                for (const triggerObj of rule["triggers"]) {
                    for (const triggerName in triggerObj) {
                        if (!availableTriggers_1.availableTriggers[triggerName]) {
                            throw new validatorUtils_1.StrictValidationError([`Unknown trigger '${triggerName}' in rule '${rule.name}'`]);
                        }
                        const triggerBlueprint = availableTriggers_1.availableTriggers[triggerName];
                        if (typeof triggerBlueprint.defaultConfig === "object" && triggerBlueprint.defaultConfig != null) {
                            triggerObj[triggerName] = knub_1.configUtils.mergeConfig(triggerBlueprint.defaultConfig, triggerObj[triggerName] || {});
                        }
                        else {
                            triggerObj[triggerName] = triggerObj[triggerName] || triggerBlueprint.defaultConfig;
                        }
                        if (triggerObj[triggerName].match_attachment_type) {
                            const white = triggerObj[triggerName].match_attachment_type.whitelist_enabled;
                            const black = triggerObj[triggerName].match_attachment_type.blacklist_enabled;
                            if (white && black) {
                                throw new validatorUtils_1.StrictValidationError([
                                    `Cannot have both blacklist and whitelist enabled at rule <${rule.name}/match_attachment_type>`,
                                ]);
                            }
                            else if (!white && !black) {
                                throw new validatorUtils_1.StrictValidationError([
                                    `Must have either blacklist or whitelist enabled at rule <${rule.name}/match_attachment_type>`,
                                ]);
                            }
                        }
                    }
                }
            }
            if (rule["actions"]) {
                for (const actionName in rule["actions"]) {
                    if (!availableActions_1.availableActions[actionName]) {
                        throw new validatorUtils_1.StrictValidationError([`Unknown action '${actionName}' in rule '${rule.name}'`]);
                    }
                    const actionBlueprint = availableActions_1.availableActions[actionName];
                    const actionConfig = rule["actions"][actionName];
                    if (typeof actionConfig !== "object" || Array.isArray(actionConfig) || actionConfig == null) {
                        rule["actions"][actionName] = actionConfig;
                    }
                    else {
                        rule["actions"][actionName] = knub_1.configUtils.mergeConfig(actionBlueprint.defaultConfig, actionConfig);
                    }
                }
            }
            // Enable logging of automod actions by default
            if (rule["actions"]) {
                for (const actionName in rule.actions) {
                    if (!availableActions_1.availableActions[actionName]) {
                        throw new validatorUtils_1.StrictValidationError([`Unknown action '${actionName}' in rule '${rule.name}'`]);
                    }
                }
                if (rule["actions"]["log"] == null) {
                    rule["actions"]["log"] = true;
                }
            }
        }
    }
    return options;
};
exports.AutomodPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "automod",
    showInDocs: true,
    info: info_1.pluginInfo,
    // prettier-ignore
    dependencies: [
        LogsPlugin_1.LogsPlugin,
        ModActionsPlugin_1.ModActionsPlugin,
        MutesPlugin_1.MutesPlugin,
        CountersPlugin_1.CountersPlugin,
    ],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    configPreprocessor,
    customOverrideCriteriaFunctions: {
        antiraid_level: (pluginData, matchParams, value) => {
            return value ? value === pluginData.state.cachedAntiraidLevel : false;
        },
    },
    // prettier-ignore
    events: [
        RunAutomodOnJoinEvt_1.RunAutomodOnJoinEvt,
        RunAutomodOnMemberUpdate_1.RunAutomodOnMemberUpdate,
    ],
    commands: [AntiraidClearCmd_1.AntiraidClearCmd, SetAntiraidCmd_1.SetAntiraidCmd, ViewAntiraidCmd_1.ViewAntiraidCmd],
    async beforeLoad(pluginData) {
        pluginData.state.queue = new Queue_1.Queue();
        pluginData.state.regexRunner = regExpRunners_1.getRegExpRunner(`guild-${pluginData.guild.id}`);
        pluginData.state.recentActions = [];
        pluginData.state.recentSpam = [];
        pluginData.state.recentNicknameChanges = new Map();
        pluginData.state.ignoredRoleChanges = new Set();
        pluginData.state.cooldownManager = new knub_1.CooldownManager();
        pluginData.state.logs = new GuildLogs_1.GuildLogs(pluginData.guild.id);
        pluginData.state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(pluginData.guild.id);
        pluginData.state.antiraidLevels = GuildAntiraidLevels_1.GuildAntiraidLevels.getGuildInstance(pluginData.guild.id);
        pluginData.state.archives = GuildArchives_1.GuildArchives.getGuildInstance(pluginData.guild.id);
        pluginData.state.cachedAntiraidLevel = await pluginData.state.antiraidLevels.get();
    },
    async afterLoad(pluginData) {
        pluginData.state.clearRecentActionsInterval = setInterval(() => clearOldRecentActions_1.clearOldRecentActions(pluginData), 1 * utils_1.MINUTES);
        pluginData.state.clearRecentSpamInterval = setInterval(() => clearOldRecentSpam_1.clearOldRecentSpam(pluginData), 1 * utils_1.SECONDS);
        pluginData.state.clearRecentNicknameChangesInterval = setInterval(() => clearOldNicknameChanges_1.clearOldRecentNicknameChanges(pluginData), 30 * utils_1.SECONDS);
        pluginData.state.onMessageCreateFn = message => runAutomodOnMessage_1.runAutomodOnMessage(pluginData, message, false);
        pluginData.state.savedMessages.events.on("create", pluginData.state.onMessageCreateFn);
        pluginData.state.onMessageUpdateFn = message => runAutomodOnMessage_1.runAutomodOnMessage(pluginData, message, true);
        pluginData.state.savedMessages.events.on("update", pluginData.state.onMessageUpdateFn);
        const countersPlugin = pluginData.getPlugin(CountersPlugin_1.CountersPlugin);
        pluginData.state.onCounterTrigger = (name, triggerName, channelId, userId) => {
            runAutomodOnCounterTrigger_1.runAutomodOnCounterTrigger(pluginData, name, triggerName, channelId, userId, false);
        };
        pluginData.state.onCounterReverseTrigger = (name, triggerName, channelId, userId) => {
            runAutomodOnCounterTrigger_1.runAutomodOnCounterTrigger(pluginData, name, triggerName, channelId, userId, true);
        };
        countersPlugin.onCounterEvent("trigger", pluginData.state.onCounterTrigger);
        countersPlugin.onCounterEvent("reverseTrigger", pluginData.state.onCounterReverseTrigger);
        const modActionsEvents = pluginData.getPlugin(ModActionsPlugin_1.ModActionsPlugin).getEventEmitter();
        pluginData.state.modActionsListeners = new Map();
        pluginData.state.modActionsListeners.set("note", (userId) => runAutomodOnModAction_1.runAutomodOnModAction(pluginData, "note", userId));
        pluginData.state.modActionsListeners.set("warn", (userId, reason, isAutomodAction) => runAutomodOnModAction_1.runAutomodOnModAction(pluginData, "warn", userId, reason, isAutomodAction));
        pluginData.state.modActionsListeners.set("kick", (userId, reason, isAutomodAction) => runAutomodOnModAction_1.runAutomodOnModAction(pluginData, "kick", userId, reason, isAutomodAction));
        pluginData.state.modActionsListeners.set("ban", (userId, reason, isAutomodAction) => runAutomodOnModAction_1.runAutomodOnModAction(pluginData, "ban", userId, reason, isAutomodAction));
        pluginData.state.modActionsListeners.set("unban", (userId) => runAutomodOnModAction_1.runAutomodOnModAction(pluginData, "unban", userId));
        registerEventListenersFromMap_1.registerEventListenersFromMap(modActionsEvents, pluginData.state.modActionsListeners);
        const mutesEvents = pluginData.getPlugin(MutesPlugin_1.MutesPlugin).getEventEmitter();
        pluginData.state.mutesListeners = new Map();
        pluginData.state.mutesListeners.set("mute", (userId, reason, isAutomodAction) => runAutomodOnModAction_1.runAutomodOnModAction(pluginData, "mute", userId, reason, isAutomodAction));
        pluginData.state.mutesListeners.set("unmute", (userId) => runAutomodOnModAction_1.runAutomodOnModAction(pluginData, "unmute", userId));
        registerEventListenersFromMap_1.registerEventListenersFromMap(mutesEvents, pluginData.state.mutesListeners);
    },
    async beforeUnload(pluginData) {
        const countersPlugin = pluginData.getPlugin(CountersPlugin_1.CountersPlugin);
        countersPlugin.offCounterEvent("trigger", pluginData.state.onCounterTrigger);
        countersPlugin.offCounterEvent("reverseTrigger", pluginData.state.onCounterReverseTrigger);
        const modActionsEvents = pluginData.getPlugin(ModActionsPlugin_1.ModActionsPlugin).getEventEmitter();
        unregisterEventListenersFromMap_1.unregisterEventListenersFromMap(modActionsEvents, pluginData.state.modActionsListeners);
        const mutesEvents = pluginData.getPlugin(MutesPlugin_1.MutesPlugin).getEventEmitter();
        unregisterEventListenersFromMap_1.unregisterEventListenersFromMap(mutesEvents, pluginData.state.mutesListeners);
        pluginData.state.queue.clear();
        regExpRunners_1.discardRegExpRunner(`guild-${pluginData.guild.id}`);
        clearInterval(pluginData.state.clearRecentActionsInterval);
        clearInterval(pluginData.state.clearRecentSpamInterval);
        clearInterval(pluginData.state.clearRecentNicknameChangesInterval);
        pluginData.state.savedMessages.events.off("create", pluginData.state.onMessageCreateFn);
        pluginData.state.savedMessages.events.off("update", pluginData.state.onMessageUpdateFn);
    },
});
