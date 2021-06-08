"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGuildConfig = void 0;
const availablePlugins_1 = require("./plugins/availablePlugins");
const validatorUtils_1 = require("./validatorUtils");
const types_1 = require("./types");
const knub_1 = require("knub");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const pluginNameToPlugin = new Map();
for (const plugin of availablePlugins_1.guildPlugins) {
    pluginNameToPlugin.set(plugin.name, plugin);
}
async function validateGuildConfig(config) {
    const validationResult = validatorUtils_1.decodeAndValidateStrict(types_1.PartialZeppelinGuildConfigSchema, config);
    if (validationResult instanceof validatorUtils_1.StrictValidationError)
        return validationResult.getErrors();
    const guildConfig = config;
    if (guildConfig.timezone) {
        const validTimezones = moment_timezone_1.default.tz.names();
        if (!validTimezones.includes(guildConfig.timezone)) {
            return `Invalid timezone: ${guildConfig.timezone}`;
        }
    }
    if (guildConfig.plugins) {
        for (const [pluginName, pluginOptions] of Object.entries(guildConfig.plugins)) {
            if (!pluginNameToPlugin.has(pluginName)) {
                return `Unknown plugin: ${pluginName}`;
            }
            if (typeof pluginOptions !== "object" || pluginOptions == null) {
                return `Invalid options specified for plugin ${pluginName}`;
            }
            const plugin = pluginNameToPlugin.get(pluginName);
            try {
                const mergedOptions = knub_1.configUtils.mergeConfig(plugin.defaultOptions || {}, pluginOptions);
                await plugin.configPreprocessor?.(mergedOptions, true);
            }
            catch (err) {
                if (err instanceof knub_1.ConfigValidationError || err instanceof validatorUtils_1.StrictValidationError) {
                    return `${pluginName}: ${err.message}`;
                }
                throw err;
            }
        }
    }
    return null;
}
exports.validateGuildConfig = validateGuildConfig;
