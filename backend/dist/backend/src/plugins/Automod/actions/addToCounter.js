"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCounterAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const CountersPlugin_1 = require("../../Counters/CountersPlugin");
const LogType_1 = require("../../../data/LogType");
exports.AddToCounterAction = helpers_1.automodAction({
    configType: t.type({
        counter: t.string,
        amount: t.number,
    }),
    defaultConfig: {},
    async apply({ pluginData, contexts, actionConfig, matchResult, ruleName }) {
        const countersPlugin = pluginData.getPlugin(CountersPlugin_1.CountersPlugin);
        if (!countersPlugin.counterExists(actionConfig.counter)) {
            pluginData.state.logs.log(LogType_1.LogType.BOT_ALERT, {
                body: `Unknown counter \`${actionConfig.counter}\` in \`add_to_counter\` action of Automod rule \`${ruleName}\``,
            });
            return;
        }
        countersPlugin.changeCounterValue(actionConfig.counter, contexts[0].message?.channel_id || null, contexts[0].user?.id || null, actionConfig.amount);
    },
});
