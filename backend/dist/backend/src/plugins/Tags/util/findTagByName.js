"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTagByName = void 0;
async function findTagByName(pluginData, name, matchParams = {}) {
    const config = await pluginData.config.getMatchingConfig(matchParams);
    // Tag from a hardcoded category
    // Format: "category.tag"
    const categorySeparatorIndex = name.indexOf(".");
    if (categorySeparatorIndex > 0) {
        const categoryName = name.slice(0, categorySeparatorIndex);
        const tagName = name.slice(categorySeparatorIndex + 1);
        return config.categories[categoryName]?.tags[tagName] ?? null;
    }
    // Dynamic tag
    // Format: "tag"
    const dynamicTag = await pluginData.state.tags.find(name);
    return dynamicTag?.body ?? null;
}
exports.findTagByName = findTagByName;
