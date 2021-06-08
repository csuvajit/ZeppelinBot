"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zeppelinGlobalPlugin = exports.zeppelinGuildPlugin = void 0;
const knub_1 = require("knub");
const pluginUtils_1 = require("../pluginUtils");
function zeppelinGuildPlugin(...args) {
    if (args.length) {
        const blueprint = knub_1.typedGuildPlugin(...args);
        blueprint.configPreprocessor = pluginUtils_1.getPluginConfigPreprocessor(blueprint, blueprint.configPreprocessor);
        return blueprint;
    }
    else {
        return zeppelinGuildPlugin;
    }
}
exports.zeppelinGuildPlugin = zeppelinGuildPlugin;
function zeppelinGlobalPlugin(...args) {
    if (args.length) {
        const blueprint = knub_1.typedGlobalPlugin(...args);
        // @ts-ignore FIXME: Check the types here
        blueprint.configPreprocessor = pluginUtils_1.getPluginConfigPreprocessor(blueprint, blueprint.configPreprocessor);
        return blueprint;
    }
    else {
        return zeppelinGlobalPlugin;
    }
}
exports.zeppelinGlobalPlugin = zeppelinGlobalPlugin;
