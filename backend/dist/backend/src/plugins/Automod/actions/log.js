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
exports.LogAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const LogType_1 = require("../../../data/LogType");
const utils_1 = require("../../../utils");
exports.LogAction = helpers_1.automodAction({
    configType: t.boolean,
    defaultConfig: true,
    async apply({ pluginData, contexts, ruleName, matchResult }) {
        const safeUsers = utils_1.unique(contexts.map(c => c.user))
            .filter(Boolean)
            .map(user => utils_1.stripObjectToScalars(user));
        const safeUser = safeUsers[0];
        const actionsTaken = Object.keys(pluginData.config.get().rules[ruleName].actions).join(", ");
        pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.AUTOMOD_ACTION, {
            rule: ruleName,
            user: safeUser,
            users: safeUsers,
            actionsTaken,
            matchSummary: matchResult.summary,
        });
    },
});
