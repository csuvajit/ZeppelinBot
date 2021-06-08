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
exports.ChangeNicknameAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const LogType_1 = require("../../../data/LogType");
const LogsPlugin_1 = require("../../Logs/LogsPlugin");
const utils_1 = require("../../../utils");
exports.ChangeNicknameAction = helpers_1.automodAction({
    configType: t.union([
        t.string,
        t.type({
            name: t.string,
        }),
    ]),
    defaultConfig: {},
    async apply({ pluginData, contexts, actionConfig }) {
        const members = utils_1.unique(contexts.map(c => c.member).filter(utils_1.nonNullish));
        for (const member of members) {
            if (pluginData.state.recentNicknameChanges.has(member.id))
                continue;
            const newName = typeof actionConfig === "string" ? actionConfig : actionConfig.name;
            member.edit({ nick: newName }).catch(err => {
                pluginData.getPlugin(LogsPlugin_1.LogsPlugin).log(LogType_1.LogType.BOT_ALERT, {
                    body: `Failed to change the nickname of \`${member.id}\``,
                });
            });
            pluginData.state.recentNicknameChanges.set(member.id, { timestamp: Date.now() });
        }
    },
});
