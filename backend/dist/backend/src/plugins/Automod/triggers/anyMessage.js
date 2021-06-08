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
exports.AnyMessageTrigger = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
exports.AnyMessageTrigger = helpers_1.automodTrigger()({
    configType: t.type({}),
    defaultConfig: {},
    async match({ pluginData, context, triggerConfig: trigger }) {
        if (!context.message) {
            return;
        }
        return {
            extra: {},
        };
    },
    renderMatchInformation({ pluginData, contexts, matchResult }) {
        const channel = pluginData.guild.channels.get(contexts[0].message.channel_id);
        return `Matched message (\`${contexts[0].message.id}\`) in ${channel ? utils_1.verboseChannelMention(channel) : "Unknown Channel"}`;
    },
});
