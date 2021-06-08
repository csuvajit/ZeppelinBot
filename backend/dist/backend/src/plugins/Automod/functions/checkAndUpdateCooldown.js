"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndUpdateCooldown = void 0;
const utils_1 = require("../../../utils");
function checkAndUpdateCooldown(pluginData, rule, context) {
    const cooldownKey = `${rule.name}-${context.user?.id}`;
    if (cooldownKey) {
        if (pluginData.state.cooldownManager.isOnCooldown(cooldownKey)) {
            return true;
        }
        const cooldownTime = utils_1.convertDelayStringToMS(rule.cooldown, "s");
        if (cooldownTime) {
            pluginData.state.cooldownManager.setCooldown(cooldownKey, cooldownTime);
        }
    }
    return false;
}
exports.checkAndUpdateCooldown = checkAndUpdateCooldown;
