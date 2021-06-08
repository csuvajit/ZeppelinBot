"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountersPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildCounters_1 = require("../../data/GuildCounters");
const pluginUtils_1 = require("../../pluginUtils");
const changeCounterValue_1 = require("./functions/changeCounterValue");
const setCounterValue_1 = require("./functions/setCounterValue");
const utils_1 = require("../../utils");
const events_1 = require("events");
const onCounterEvent_1 = require("./functions/onCounterEvent");
const offCounterEvent_1 = require("./functions/offCounterEvent");
const decayCounter_1 = require("./functions/decayCounter");
const validatorUtils_1 = require("../../validatorUtils");
const ViewCounterCmd_1 = require("./commands/ViewCounterCmd");
const AddCounterCmd_1 = require("./commands/AddCounterCmd");
const SetCounterCmd_1 = require("./commands/SetCounterCmd");
const CounterTrigger_1 = require("../../data/entities/CounterTrigger");
const getPrettyNameForCounter_1 = require("./functions/getPrettyNameForCounter");
const getPrettyNameForCounterTrigger_1 = require("./functions/getPrettyNameForCounterTrigger");
const counterExists_1 = require("./functions/counterExists");
const ResetAllCounterValuesCmd_1 = require("./commands/ResetAllCounterValuesCmd");
const CountersListCmd_1 = require("./commands/CountersListCmd");
const ResetCounterCmd_1 = require("./commands/ResetCounterCmd");
const MAX_COUNTERS = 5;
const MAX_TRIGGERS_PER_COUNTER = 5;
const DECAY_APPLY_INTERVAL = 5 * utils_1.MINUTES;
const defaultOptions = {
    config: {
        counters: {},
        can_view: false,
        can_edit: false,
        can_reset_all: false,
    },
    overrides: [
        {
            level: ">=50",
            config: {
                can_view: true,
            },
        },
        {
            level: ">=100",
            config: {
                can_edit: true,
            },
        },
    ],
};
const configPreprocessor = options => {
    for (const [counterName, counter] of Object.entries(options.config?.counters || {})) {
        counter.name = counterName;
        counter.per_user = counter.per_user ?? false;
        counter.per_channel = counter.per_channel ?? false;
        counter.initial_value = counter.initial_value ?? 0;
        counter.triggers = counter.triggers || {};
        if (Object.values(counter.triggers).length > MAX_TRIGGERS_PER_COUNTER) {
            throw new validatorUtils_1.StrictValidationError([`You can only have at most ${MAX_TRIGGERS_PER_COUNTER} triggers per counter`]);
        }
        // Normalize triggers
        for (const [triggerName, trigger] of Object.entries(counter.triggers)) {
            const triggerObj = typeof trigger === "string" ? { condition: trigger } : trigger;
            triggerObj.name = triggerName;
            const parsedCondition = CounterTrigger_1.parseCounterConditionString(triggerObj.condition || "");
            if (!parsedCondition) {
                throw new validatorUtils_1.StrictValidationError([
                    `Invalid comparison in counter trigger ${counterName}/${triggerName}: "${triggerObj.condition}"`,
                ]);
            }
            triggerObj.condition = CounterTrigger_1.buildCounterConditionString(parsedCondition[0], parsedCondition[1]);
            triggerObj.reverse_condition =
                triggerObj.reverse_condition ||
                    CounterTrigger_1.buildCounterConditionString(CounterTrigger_1.getReverseCounterComparisonOp(parsedCondition[0]), parsedCondition[1]);
            counter.triggers[triggerName] = triggerObj;
        }
    }
    if (Object.values(options.config?.counters || {}).length > MAX_COUNTERS) {
        throw new validatorUtils_1.StrictValidationError([`You can only have at most ${MAX_COUNTERS} counters`]);
    }
    return options;
};
/**
 * The Counters plugin keeps track of simple integer values that are tied to a user, channel, both, or neither — "counters".
 * These values can be changed using the functions in the plugin's public interface.
 * These values can also be set to automatically decay over time.
 *
 * Triggers can be registered that check for a specific condition, e.g. "when this counter is over 100".
 * Triggers are checked against every time a counter's value changes, and will emit an event when triggered.
 * A single trigger can only trigger once per user/channel/in general, depending on how specific the counter is (e.g. a per-user trigger can only trigger once per user).
 * After being triggered, a trigger is "reset" if the counter value no longer matches the trigger (e.g. drops to 100 or below in the above example). After this, that trigger can be triggered again.
 */
exports.CountersPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "counters",
    showInDocs: true,
    info: {
        prettyName: "Counters",
        description: "Keep track of per-user, per-channel, or global numbers and trigger specific actions based on this number",
        configurationGuide: "See <a href='/docs/setup-guides/counters'>Counters setup guide</a>",
    },
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    configPreprocessor,
    public: {
        counterExists: pluginUtils_1.mapToPublicFn(counterExists_1.counterExists),
        // Change a counter's value by a relative amount, e.g. +5
        changeCounterValue: pluginUtils_1.mapToPublicFn(changeCounterValue_1.changeCounterValue),
        // Set a counter's value to an absolute value
        setCounterValue: pluginUtils_1.mapToPublicFn(setCounterValue_1.setCounterValue),
        getPrettyNameForCounter: pluginUtils_1.mapToPublicFn(getPrettyNameForCounter_1.getPrettyNameForCounter),
        getPrettyNameForCounterTrigger: pluginUtils_1.mapToPublicFn(getPrettyNameForCounterTrigger_1.getPrettyNameForCounterTrigger),
        onCounterEvent: pluginUtils_1.mapToPublicFn(onCounterEvent_1.onCounterEvent),
        offCounterEvent: pluginUtils_1.mapToPublicFn(offCounterEvent_1.offCounterEvent),
    },
    // prettier-ignore
    commands: [
        CountersListCmd_1.CountersListCmd,
        ViewCounterCmd_1.ViewCounterCmd,
        AddCounterCmd_1.AddCounterCmd,
        SetCounterCmd_1.SetCounterCmd,
        ResetCounterCmd_1.ResetCounterCmd,
        ResetAllCounterValuesCmd_1.ResetAllCounterValuesCmd,
    ],
    async beforeLoad(pluginData) {
        pluginData.state.counters = new GuildCounters_1.GuildCounters(pluginData.guild.id);
        pluginData.state.events = new events_1.EventEmitter();
        pluginData.state.counterTriggersByCounterId = new Map();
        const activeTriggerIds = [];
        // Initialize and store the IDs of each of the counters internally
        pluginData.state.counterIds = {};
        const config = pluginData.config.get();
        for (const counter of Object.values(config.counters)) {
            const dbCounter = await pluginData.state.counters.findOrCreateCounter(counter.name, counter.per_channel, counter.per_user);
            pluginData.state.counterIds[counter.name] = dbCounter.id;
            const thisCounterTriggers = [];
            pluginData.state.counterTriggersByCounterId.set(dbCounter.id, thisCounterTriggers);
            // Initialize triggers
            for (const trigger of Object.values(counter.triggers)) {
                const theTrigger = trigger;
                const parsedCondition = CounterTrigger_1.parseCounterConditionString(theTrigger.condition);
                const parsedReverseCondition = CounterTrigger_1.parseCounterConditionString(theTrigger.reverse_condition);
                const counterTrigger = await pluginData.state.counters.initCounterTrigger(dbCounter.id, theTrigger.name, parsedCondition[0], parsedCondition[1], parsedReverseCondition[0], parsedReverseCondition[1]);
                activeTriggerIds.push(counterTrigger.id);
                thisCounterTriggers.push(counterTrigger);
            }
        }
        // Mark old/unused counters to be deleted later
        await pluginData.state.counters.markUnusedCountersToBeDeleted([...Object.values(pluginData.state.counterIds)]);
        // Mark old/unused triggers to be deleted later
        await pluginData.state.counters.markUnusedTriggersToBeDeleted(activeTriggerIds);
    },
    async afterLoad(pluginData) {
        const config = pluginData.config.get();
        // Start decay timers
        pluginData.state.decayTimers = [];
        for (const [counterName, counter] of Object.entries(config.counters)) {
            if (!counter.decay) {
                continue;
            }
            const decay = counter.decay;
            const decayPeriodMs = utils_1.convertDelayStringToMS(decay.every);
            pluginData.state.decayTimers.push(setInterval(() => {
                decayCounter_1.decayCounter(pluginData, counterName, decayPeriodMs, decay.amount);
            }, DECAY_APPLY_INTERVAL));
        }
    },
    beforeUnload(pluginData) {
        for (const interval of pluginData.state.decayTimers) {
            clearInterval(interval);
        }
        pluginData.state.events.removeAllListeners();
    },
});
