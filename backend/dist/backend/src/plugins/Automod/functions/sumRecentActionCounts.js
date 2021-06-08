"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumRecentActionCounts = void 0;
function sumRecentActionCounts(actions) {
    return actions.reduce((total, action) => total + action.count, 0);
}
exports.sumRecentActionCounts = sumRecentActionCounts;
