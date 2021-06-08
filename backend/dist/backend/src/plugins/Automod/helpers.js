"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automodAction = exports.automodTrigger = void 0;
function automodTrigger(...args) {
    if (args.length) {
        return args[0];
    }
    else {
        return automodTrigger;
    }
}
exports.automodTrigger = automodTrigger;
function automodAction(blueprint) {
    return blueprint;
}
exports.automodAction = automodAction;
