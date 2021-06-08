"use strict";
/**
 * @file Utility functions that are plugin-instance-specific (i.e. use PluginData)
 */
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
exports.mapToPublicFn = exports.isOwnerPreFilter = exports.isOwner = exports.getBaseUrl = exports.sendErrorMessage = exports.sendSuccessMessage = exports.getPluginConfigPreprocessor = exports.strictValidationErrorToConfigValidationError = exports.hasPermission = exports.canActOn = void 0;
const knub_1 = require("knub");
const validatorUtils_1 = require("./validatorUtils");
const utils_1 = require("./utils");
const t = __importStar(require("io-ts"));
const logger_1 = require("./logger");
const { getMemberLevel } = knub_1.helpers;
function canActOn(pluginData, member1, member2, allowSameLevel = false) {
    if (member2.id === pluginData.client.user.id) {
        return false;
    }
    const ourLevel = getMemberLevel(pluginData, member1);
    const memberLevel = getMemberLevel(pluginData, member2);
    return allowSameLevel ? ourLevel >= memberLevel : ourLevel > memberLevel;
}
exports.canActOn = canActOn;
async function hasPermission(pluginData, permission, matchParams) {
    const config = await pluginData.config.getMatchingConfig(matchParams);
    return knub_1.helpers.hasPermission(config, permission);
}
exports.hasPermission = hasPermission;
const PluginOverrideCriteriaType = t.recursion("PluginOverrideCriteriaType", () => t.partial({
    channel: utils_1.tNullable(t.union([t.string, t.array(t.string)])),
    category: utils_1.tNullable(t.union([t.string, t.array(t.string)])),
    level: utils_1.tNullable(t.union([t.string, t.array(t.string)])),
    user: utils_1.tNullable(t.union([t.string, t.array(t.string)])),
    role: utils_1.tNullable(t.union([t.string, t.array(t.string)])),
    all: utils_1.tNullable(t.array(PluginOverrideCriteriaType)),
    any: utils_1.tNullable(t.array(PluginOverrideCriteriaType)),
    not: utils_1.tNullable(PluginOverrideCriteriaType),
    extra: t.unknown,
}));
const validTopLevelOverrideKeys = [
    "channel",
    "category",
    "level",
    "user",
    "role",
    "all",
    "any",
    "not",
    "extra",
    "config",
];
const BasicPluginStructureType = t.type({
    enabled: utils_1.tNullable(t.boolean),
    config: utils_1.tNullable(t.unknown),
    overrides: utils_1.tNullable(t.array(t.union([PluginOverrideCriteriaType, t.type({ config: t.unknown })]))),
    replaceDefaultOverrides: utils_1.tNullable(t.boolean),
});
function strictValidationErrorToConfigValidationError(err) {
    return new knub_1.ConfigValidationError(err
        .getErrors()
        .map(e => e.toString())
        .join("\n"));
}
exports.strictValidationErrorToConfigValidationError = strictValidationErrorToConfigValidationError;
function getPluginConfigPreprocessor(blueprint, customPreprocessor) {
    return async (options, strict) => {
        // 1. Validate the basic structure of plugin config
        const basicOptionsValidation = validatorUtils_1.validate(BasicPluginStructureType, options);
        if (basicOptionsValidation instanceof validatorUtils_1.StrictValidationError) {
            throw strictValidationErrorToConfigValidationError(basicOptionsValidation);
        }
        // 2. Validate config/overrides against *partial* config schema. This ensures valid properties have valid types.
        const partialConfigSchema = utils_1.tDeepPartial(blueprint.configSchema);
        if (options.config) {
            const partialConfigValidation = validatorUtils_1.validate(partialConfigSchema, options.config);
            if (partialConfigValidation instanceof validatorUtils_1.StrictValidationError) {
                throw strictValidationErrorToConfigValidationError(partialConfigValidation);
            }
        }
        if (options.overrides) {
            for (const override of options.overrides) {
                // Validate criteria and extra criteria
                // FIXME: This is ugly
                for (const key of Object.keys(override)) {
                    if (!validTopLevelOverrideKeys.includes(key)) {
                        if (strict) {
                            throw new knub_1.ConfigValidationError(`Unknown override criterion '${key}'`);
                        }
                        delete override[key];
                    }
                }
                if (override.extra != null) {
                    for (const extraCriterion of Object.keys(override.extra)) {
                        if (!blueprint.customOverrideCriteriaFunctions?.[extraCriterion]) {
                            if (strict) {
                                throw new knub_1.ConfigValidationError(`Unknown override extra criterion '${extraCriterion}'`);
                            }
                            delete override.extra[extraCriterion];
                        }
                    }
                }
                // Validate override config
                const partialOverrideConfigValidation = validatorUtils_1.decodeAndValidateStrict(partialConfigSchema, override.config || {});
                if (partialOverrideConfigValidation instanceof validatorUtils_1.StrictValidationError) {
                    throw strictValidationErrorToConfigValidationError(partialOverrideConfigValidation);
                }
            }
        }
        // 3. Run custom preprocessor, if any
        if (customPreprocessor) {
            options = await customPreprocessor(options);
        }
        // 4. Merge with default options and validate/decode the entire config
        let decodedConfig = {};
        const decodedOverrides = [];
        if (options.config) {
            decodedConfig = blueprint.configSchema
                ? validatorUtils_1.decodeAndValidateStrict(blueprint.configSchema, options.config)
                : options.config;
            if (decodedConfig instanceof validatorUtils_1.StrictValidationError) {
                throw strictValidationErrorToConfigValidationError(decodedConfig);
            }
        }
        if (options.overrides) {
            for (const override of options.overrides) {
                const overrideConfigMergedWithBaseConfig = knub_1.configUtils.mergeConfig(options.config, override.config || {});
                const decodedOverrideConfig = blueprint.configSchema
                    ? validatorUtils_1.decodeAndValidateStrict(blueprint.configSchema, overrideConfigMergedWithBaseConfig)
                    : overrideConfigMergedWithBaseConfig;
                if (decodedOverrideConfig instanceof validatorUtils_1.StrictValidationError) {
                    throw strictValidationErrorToConfigValidationError(decodedOverrideConfig);
                }
                decodedOverrides.push({
                    ...override,
                    config: utils_1.deepKeyIntersect(decodedOverrideConfig, override.config || {}),
                });
            }
        }
        return {
            config: decodedConfig,
            overrides: decodedOverrides,
        };
    };
}
exports.getPluginConfigPreprocessor = getPluginConfigPreprocessor;
function sendSuccessMessage(pluginData, channel, body, allowedMentions) {
    const emoji = pluginData.fullConfig.success_emoji || undefined;
    const formattedBody = utils_1.successMessage(body, emoji);
    const content = allowedMentions
        ? { content: formattedBody, allowedMentions }
        : { content: formattedBody };
    return channel
        .createMessage(content) // Force line break
        .catch(err => {
        const channelInfo = channel.guild
            ? `${channel.id} (${channel.guild.id})`
            : `${channel.id}`;
        logger_1.logger.warn(`Failed to send success message to ${channelInfo}): ${err.code} ${err.message}`);
        return undefined;
    });
}
exports.sendSuccessMessage = sendSuccessMessage;
function sendErrorMessage(pluginData, channel, body, allowedMentions) {
    const emoji = pluginData.fullConfig.error_emoji || undefined;
    const formattedBody = utils_1.errorMessage(body, emoji);
    const content = allowedMentions
        ? { content: formattedBody, allowedMentions }
        : { content: formattedBody };
    return channel
        .createMessage(content) // Force line break
        .catch(err => {
        const channelInfo = channel.guild
            ? `${channel.id} (${channel.guild.id})`
            : `${channel.id}`;
        logger_1.logger.warn(`Failed to send error message to ${channelInfo}): ${err.code} ${err.message}`);
        return undefined;
    });
}
exports.sendErrorMessage = sendErrorMessage;
function getBaseUrl(pluginData) {
    const knub = pluginData.getKnubInstance();
    return knub.getGlobalConfig().url;
}
exports.getBaseUrl = getBaseUrl;
function isOwner(pluginData, userId) {
    const knub = pluginData.getKnubInstance();
    const owners = knub.getGlobalConfig().owners;
    if (!owners) {
        return false;
    }
    return owners.includes(userId);
}
exports.isOwner = isOwner;
const isOwnerPreFilter = (_, context) => {
    return isOwner(context.pluginData, context.message.author.id);
};
exports.isOwnerPreFilter = isOwnerPreFilter;
/**
 * Creates a public plugin function out of a function with pluginData as the first parameter
 */
function mapToPublicFn(inputFn) {
    return pluginData => {
        return (...args) => {
            return inputFn(pluginData, ...args);
        };
    };
}
exports.mapToPublicFn = mapToPublicFn;
