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
exports.GuildConfigReloaderPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const Configs_1 = require("../../data/Configs");
const reloadChangedGuilds_1 = require("./functions/reloadChangedGuilds");
const t = __importStar(require("io-ts"));
exports.GuildConfigReloaderPlugin = ZeppelinPluginBlueprint_1.zeppelinGlobalPlugin()({
    name: "guild_config_reloader",
    showInDocs: false,
    configSchema: t.type({}),
    async beforeLoad(pluginData) {
        pluginData.state.guildConfigs = new Configs_1.Configs();
        pluginData.state.highestConfigId = await pluginData.state.guildConfigs.getHighestId();
    },
    afterLoad(pluginData) {
        reloadChangedGuilds_1.reloadChangedGuilds(pluginData);
    },
    beforeUnload(pluginData) {
        clearTimeout(pluginData.state.nextCheckTimeout);
        pluginData.state.unloaded = true;
    },
});
