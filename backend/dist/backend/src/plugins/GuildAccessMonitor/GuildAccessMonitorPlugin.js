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
exports.GuildAccessMonitorPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const knub_1 = require("knub");
const t = __importStar(require("io-ts"));
const AllowedGuilds_1 = require("../../data/AllowedGuilds");
async function checkGuild(pluginData, guild) {
    if (!(await pluginData.state.allowedGuilds.isAllowed(guild.id))) {
        console.log(`Non-allowed server ${guild.name} (${guild.id}), leaving`);
        console.log("[Temporarily not leaving automatically]");
        // guild.leave();
    }
}
/**
 * Global plugin to monitor if Zeppelin is invited to a non-whitelisted server, and leave it
 */
exports.GuildAccessMonitorPlugin = ZeppelinPluginBlueprint_1.zeppelinGlobalPlugin()({
    name: "guild_access_monitor",
    configSchema: t.type({}),
    events: [
        knub_1.typedGlobalEventListener()({
            event: "guildAvailable",
            listener({ pluginData, args: { guild } }) {
                checkGuild(pluginData, guild);
            },
        }),
    ],
    beforeLoad(pluginData) {
        pluginData.state.allowedGuilds = new AllowedGuilds_1.AllowedGuilds();
    },
    afterLoad(pluginData) {
        for (const guild of pluginData.client.guilds.values()) {
            checkGuild(pluginData, guild);
        }
    },
});
