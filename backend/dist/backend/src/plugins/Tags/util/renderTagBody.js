"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTagBody = void 0;
const templateFormatter_1 = require("../../../templateFormatter");
const utils_1 = require("../../../utils");
const findTagByName_1 = require("./findTagByName");
async function renderTagBody(pluginData, body, args = [], extraData = {}, subTagPermissionMatchParams) {
    const dynamicVars = {};
    const maxTagFnCalls = 25;
    let tagFnCalls = 0;
    const data = {
        args,
        ...extraData,
        ...pluginData.state.tagFunctions,
        set(name, val) {
            if (typeof name !== "string")
                return;
            dynamicVars[name] = val;
        },
        setr(name, val) {
            if (typeof name !== "string")
                return "";
            dynamicVars[name] = val;
            return val;
        },
        get(name) {
            return dynamicVars[name] == null ? "" : dynamicVars[name];
        },
        tag: async (name, ...subTagArgs) => {
            if (tagFnCalls++ > maxTagFnCalls)
                return "\\_recursion\\_";
            if (typeof name !== "string")
                return "";
            if (name === "")
                return "";
            const subTagBody = await findTagByName_1.findTagByName(pluginData, name, subTagPermissionMatchParams);
            if (!subTagBody) {
                return "";
            }
            if (typeof subTagBody !== "string") {
                return "<embed>";
            }
            const rendered = await renderTagBody(pluginData, subTagBody, subTagArgs, subTagPermissionMatchParams);
            return rendered.content;
        },
    };
    if (typeof body === "string") {
        // Plain text tag
        return { content: await templateFormatter_1.renderTemplate(body, data) };
    }
    else {
        // Embed
        return utils_1.renderRecursively(body, str => templateFormatter_1.renderTemplate(str, data));
    }
}
exports.renderTagBody = renderTagBody;
