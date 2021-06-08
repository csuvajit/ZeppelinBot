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
exports.SetAntiraidLevelAction = void 0;
const t = __importStar(require("io-ts"));
const helpers_1 = require("../helpers");
const setAntiraidLevel_1 = require("../functions/setAntiraidLevel");
const utils_1 = require("../../../utils");
exports.SetAntiraidLevelAction = helpers_1.automodAction({
    configType: utils_1.tNullable(t.string),
    defaultConfig: "",
    async apply({ pluginData, contexts, actionConfig }) {
        setAntiraidLevel_1.setAntiraidLevel(pluginData, actionConfig ?? null);
    },
});
