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
exports.MemberJoinTrigger = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const utils_1 = require("../../../utils");
exports.MemberJoinTrigger = helpers_1.automodTrigger()({
    configType: t.type({
        only_new: t.boolean,
        new_threshold: utils_1.tDelayString,
    }),
    defaultConfig: {
        only_new: false,
        new_threshold: "1h",
    },
    async match({ pluginData, context, triggerConfig }) {
        if (!context.joined || !context.member) {
            return;
        }
        if (triggerConfig.only_new) {
            const threshold = Date.now() - utils_1.convertDelayStringToMS(triggerConfig.new_threshold);
            return context.member.createdAt >= threshold ? {} : null;
        }
        return {};
    },
    renderMatchInformation({ pluginData, contexts, triggerConfig }) {
        return "";
    },
});
