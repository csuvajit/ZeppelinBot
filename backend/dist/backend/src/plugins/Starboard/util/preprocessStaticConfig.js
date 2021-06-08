"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessStaticConfig = void 0;
const types_1 = require("../types");
function preprocessStaticConfig(config) {
    if (config.boards) {
        for (const [name, opts] of Object.entries(config.boards)) {
            config.boards[name] = Object.assign({}, types_1.defaultStarboardOpts, config.boards[name]);
        }
    }
    return config;
}
exports.preprocessStaticConfig = preprocessStaticConfig;
