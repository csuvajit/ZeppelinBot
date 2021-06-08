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
exports.setChannelPermissionOverridesAction = exports.SetChannelPermissionOverridesAction = void 0;
const t = __importStar(require("io-ts"));
const ActionError_1 = require("../ActionError");
exports.SetChannelPermissionOverridesAction = t.type({
    type: t.literal("set_channel_permission_overrides"),
    channel: t.string,
    overrides: t.array(t.type({
        type: t.union([t.literal("member"), t.literal("role")]),
        id: t.string,
        allow: t.number,
        deny: t.number,
    })),
});
async function setChannelPermissionOverridesAction(pluginData, action, values, event, eventData) {
    const channel = pluginData.guild.channels.get(action.channel);
    if (!channel) {
        throw new ActionError_1.ActionError(`Unknown channel: ${action.channel}`);
    }
    for (const override of action.overrides) {
        await channel.editPermission(override.id, override.allow, override.deny, override.type, `Custom event: ${event.name}`);
    }
}
exports.setChannelPermissionOverridesAction = setChannelPermissionOverridesAction;
