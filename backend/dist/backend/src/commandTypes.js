"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandTypeHelpers = exports.commandTypes = void 0;
const utils_1 = require("./utils");
const eris_1 = require("eris");
const knub_1 = require("knub");
const knub_command_manager_1 = require("knub-command-manager");
const resolveMessageTarget_1 = require("./utils/resolveMessageTarget");
const validatorUtils_1 = require("./validatorUtils");
const isValidTimezone_1 = require("./utils/isValidTimezone");
exports.commandTypes = {
    ...knub_1.baseTypeConverters,
    delay(value) {
        const result = utils_1.convertDelayStringToMS(value);
        if (result == null) {
            throw new knub_1.TypeConversionError(`Could not convert ${value} to a delay`);
        }
        return result;
    },
    async resolvedUser(value, context) {
        const result = await utils_1.resolveUser(context.pluginData.client, value);
        if (result == null || result instanceof utils_1.UnknownUser) {
            throw new knub_1.TypeConversionError(`User \`${utils_1.disableCodeBlocks(value)}\` was not found`);
        }
        return result;
    },
    async resolvedUserLoose(value, context) {
        const result = await utils_1.resolveUser(context.pluginData.client, value);
        if (result == null) {
            throw new knub_1.TypeConversionError(`Invalid user: \`${utils_1.disableCodeBlocks(value)}\``);
        }
        return result;
    },
    async resolvedMember(value, context) {
        if (!(context.message.channel instanceof eris_1.GuildChannel)) {
            throw new knub_1.TypeConversionError(`Cannot resolve member for non-guild channels`);
        }
        const result = await utils_1.resolveMember(context.pluginData.client, context.message.channel.guild, value);
        if (result == null) {
            throw new knub_1.TypeConversionError(`Member \`${utils_1.disableCodeBlocks(value)}\` was not found or they have left the server`);
        }
        return result;
    },
    async messageTarget(value, context) {
        value = String(value).trim();
        const result = await resolveMessageTarget_1.resolveMessageTarget(context.pluginData, value);
        if (!result) {
            throw new knub_1.TypeConversionError(`Unknown message \`${utils_1.disableInlineCode(value)}\``);
        }
        return result;
    },
    async anyId(value, context) {
        const userId = utils_1.resolveUserId(context.pluginData.client, value);
        if (userId)
            return userId;
        const channelIdMatch = value.match(utils_1.channelMentionRegex);
        if (channelIdMatch)
            return channelIdMatch[1];
        const roleIdMatch = value.match(utils_1.roleMentionRegex);
        if (roleIdMatch)
            return roleIdMatch[1];
        if (utils_1.isValidSnowflake(value)) {
            return value;
        }
        throw new knub_1.TypeConversionError(`Could not parse ID: \`${utils_1.disableInlineCode(value)}\``);
    },
    regex(value, context) {
        try {
            return validatorUtils_1.inputPatternToRegExp(value);
        }
        catch (e) {
            throw new knub_1.TypeConversionError(`Could not parse RegExp: \`${utils_1.disableInlineCode(e.message)}\``);
        }
    },
    timezone(value) {
        if (!isValidTimezone_1.isValidTimezone(value)) {
            throw new knub_1.TypeConversionError(`Invalid timezone: ${utils_1.disableInlineCode(value)}`);
        }
        return value;
    },
};
exports.commandTypeHelpers = {
    ...knub_1.baseCommandParameterTypeHelpers,
    delay: knub_command_manager_1.createTypeHelper(exports.commandTypes.delay),
    resolvedUser: knub_command_manager_1.createTypeHelper(exports.commandTypes.resolvedUser),
    resolvedUserLoose: knub_command_manager_1.createTypeHelper(exports.commandTypes.resolvedUserLoose),
    resolvedMember: knub_command_manager_1.createTypeHelper(exports.commandTypes.resolvedMember),
    messageTarget: knub_command_manager_1.createTypeHelper(exports.commandTypes.messageTarget),
    anyId: knub_command_manager_1.createTypeHelper(exports.commandTypes.anyId),
    regex: knub_command_manager_1.createTypeHelper(exports.commandTypes.regex),
    timezone: knub_command_manager_1.createTypeHelper(exports.commandTypes.timezone),
};
