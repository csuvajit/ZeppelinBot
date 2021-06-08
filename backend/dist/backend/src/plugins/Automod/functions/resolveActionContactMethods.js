"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveActionContactMethods = void 0;
const utils_1 = require("../../../utils");
const RecoverablePluginError_1 = require("../../../RecoverablePluginError");
const eris_1 = require("eris");
function resolveActionContactMethods(pluginData, actionConfig) {
    if (actionConfig.notify === "dm") {
        return [{ type: "dm" }];
    }
    else if (actionConfig.notify === "channel") {
        if (!actionConfig.notifyChannel) {
            throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.NO_USER_NOTIFICATION_CHANNEL);
        }
        const channel = pluginData.guild.channels.get(actionConfig.notifyChannel);
        if (!(channel instanceof eris_1.TextChannel)) {
            throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.INVALID_USER_NOTIFICATION_CHANNEL);
        }
        return [{ type: "channel", channel }];
    }
    else if (actionConfig.notify && utils_1.disableUserNotificationStrings.includes(actionConfig.notify)) {
        return [];
    }
    return [];
}
exports.resolveActionContactMethods = resolveActionContactMethods;
