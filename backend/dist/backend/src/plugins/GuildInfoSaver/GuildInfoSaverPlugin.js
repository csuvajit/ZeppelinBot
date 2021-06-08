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
exports.GuildInfoSaverPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const AllowedGuilds_1 = require("../../data/AllowedGuilds");
const utils_1 = require("../../utils");
const t = __importStar(require("io-ts"));
exports.GuildInfoSaverPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "guild_info_saver",
    showInDocs: false,
    configSchema: t.type({}),
    beforeLoad(pluginData) {
        pluginData.state.allowedGuilds = new AllowedGuilds_1.AllowedGuilds();
    },
    afterLoad(pluginData) {
        updateGuildInfo(pluginData);
        pluginData.state.updateInterval = setInterval(() => updateGuildInfo(pluginData), 60 * utils_1.MINUTES);
    },
    beforeUnload(pluginData) {
        clearInterval(pluginData.state.updateInterval);
    },
});
function updateGuildInfo(pluginData) {
    pluginData.state.allowedGuilds.updateInfo(pluginData.guild.id, pluginData.guild.name, pluginData.guild.iconURL, pluginData.guild.ownerID);
}
