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
exports.UsernameSaverPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const UsernameHistory_1 = require("../../data/UsernameHistory");
const Queue_1 = require("../../Queue");
const UpdateUsernameEvts_1 = require("./events/UpdateUsernameEvts");
const t = __importStar(require("io-ts"));
exports.UsernameSaverPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "username_saver",
    showInDocs: false,
    configSchema: t.type({}),
    // prettier-ignore
    events: [
        UpdateUsernameEvts_1.MessageCreateUpdateUsernameEvt,
        UpdateUsernameEvts_1.VoiceChannelJoinUpdateUsernameEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.usernameHistory = new UsernameHistory_1.UsernameHistory();
        state.updateQueue = new Queue_1.Queue();
    },
});
