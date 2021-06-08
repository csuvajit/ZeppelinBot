"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAndRenderTagFromString = void 0;
const renderTagFromString_1 = require("./renderTagFromString");
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
async function matchAndRenderTagFromString(pluginData, str, member, extraMatchParams = {}) {
    const config = await pluginData.config.getMatchingConfig({
        ...extraMatchParams,
        member,
    });
    // Hard-coded tags in categories
    for (const [name, category] of Object.entries(config.categories)) {
        const canUse = category.can_use != null ? category.can_use : config.can_use;
        if (canUse !== true)
            continue;
        const prefix = category.prefix != null ? category.prefix : config.prefix;
        if (prefix !== "" && !str.startsWith(prefix))
            continue;
        const withoutPrefix = str.slice(prefix.length);
        for (const [tagName, tagBody] of Object.entries(category.tags)) {
            const regex = new RegExp(`^${escape_string_regexp_1.default(tagName)}(?:\\s|$)`);
            if (regex.test(withoutPrefix)) {
                const renderedContent = await renderTagFromString_1.renderTagFromString(pluginData, str, prefix, tagName, category.tags[tagName], member);
                if (renderedContent == null) {
                    return null;
                }
                return {
                    renderedContent,
                    tagName,
                    categoryName: name,
                    category,
                };
            }
        }
    }
    // Dynamic tags
    if (config.can_use !== true) {
        return null;
    }
    const dynamicTagPrefix = config.prefix;
    if (!str.startsWith(dynamicTagPrefix)) {
        return null;
    }
    const dynamicTagNameMatch = str.slice(dynamicTagPrefix.length).match(/^\S+/);
    if (dynamicTagNameMatch === null) {
        return null;
    }
    const dynamicTagName = dynamicTagNameMatch[0];
    const dynamicTag = await pluginData.state.tags.find(dynamicTagName);
    if (!dynamicTag) {
        return null;
    }
    const renderedDynamicTagContent = await renderTagFromString_1.renderTagFromString(pluginData, str, dynamicTagPrefix, dynamicTagName, dynamicTag.body, member);
    if (renderedDynamicTagContent == null) {
        return null;
    }
    return {
        renderedContent: renderedDynamicTagContent,
        tagName: dynamicTagName,
        categoryName: null,
        category: null,
    };
}
exports.matchAndRenderTagFromString = matchAndRenderTagFromString;
