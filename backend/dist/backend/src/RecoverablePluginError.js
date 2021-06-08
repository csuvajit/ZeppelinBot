"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverablePluginError = exports.RECOVERABLE_PLUGIN_ERROR_MESSAGES = exports.ERRORS = void 0;
var ERRORS;
(function (ERRORS) {
    ERRORS[ERRORS["NO_MUTE_ROLE_IN_CONFIG"] = 1] = "NO_MUTE_ROLE_IN_CONFIG";
    ERRORS[ERRORS["UNKNOWN_NOTE_CASE"] = 2] = "UNKNOWN_NOTE_CASE";
    ERRORS[ERRORS["INVALID_EMOJI"] = 3] = "INVALID_EMOJI";
    ERRORS[ERRORS["NO_USER_NOTIFICATION_CHANNEL"] = 4] = "NO_USER_NOTIFICATION_CHANNEL";
    ERRORS[ERRORS["INVALID_USER_NOTIFICATION_CHANNEL"] = 5] = "INVALID_USER_NOTIFICATION_CHANNEL";
    ERRORS[ERRORS["INVALID_USER"] = 6] = "INVALID_USER";
    ERRORS[ERRORS["INVALID_MUTE_ROLE_ID"] = 7] = "INVALID_MUTE_ROLE_ID";
    ERRORS[ERRORS["MUTE_ROLE_ABOVE_ZEP"] = 8] = "MUTE_ROLE_ABOVE_ZEP";
})(ERRORS = exports.ERRORS || (exports.ERRORS = {}));
exports.RECOVERABLE_PLUGIN_ERROR_MESSAGES = {
    [ERRORS.NO_MUTE_ROLE_IN_CONFIG]: "No mute role specified in config",
    [ERRORS.UNKNOWN_NOTE_CASE]: "Tried to add a note to an unknown case",
    [ERRORS.INVALID_EMOJI]: "Invalid emoji",
    [ERRORS.NO_USER_NOTIFICATION_CHANNEL]: "No user notify channel specified",
    [ERRORS.INVALID_USER_NOTIFICATION_CHANNEL]: "Invalid user notify channel specified",
    [ERRORS.INVALID_USER]: "Invalid user",
    [ERRORS.INVALID_MUTE_ROLE_ID]: "Specified mute role is not invalid",
    [ERRORS.MUTE_ROLE_ABOVE_ZEP]: "Specified mute role is above Zeppelin in the role hierarchy",
};
class RecoverablePluginError extends Error {
    constructor(code, guild) {
        super(exports.RECOVERABLE_PLUGIN_ERROR_MESSAGES[code]);
        this.guild = guild;
        this.code = code;
    }
}
exports.RecoverablePluginError = RecoverablePluginError;
