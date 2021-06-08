"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuildPreview = void 0;
const utils_1 = require("../../../utils");
/**
 * Memoized getGuildPreview
 */
function getGuildPreview(client, guildId) {
    return utils_1.memoize(() => client.getGuildPreview(guildId).catch(() => null), `getGuildPreview_${guildId}`, 10 * utils_1.MINUTES);
}
exports.getGuildPreview = getGuildPreview;
