"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStarboardMessageStarCount = void 0;
const createStarboardPseudoFooterForMessage_1 = require("./createStarboardPseudoFooterForMessage");
const DEBOUNCE_DELAY = 1000;
const debouncedUpdates = {};
async function updateStarboardMessageStarCount(starboard, originalMessage, starboardMessage, starEmoji, starCount) {
    const key = `${originalMessage.id}-${starboardMessage.id}`;
    if (debouncedUpdates[key]) {
        clearTimeout(debouncedUpdates[key]);
    }
    debouncedUpdates[key] = setTimeout(() => {
        delete debouncedUpdates[key];
        const embed = starboardMessage.embeds[0];
        embed.fields.pop(); // Remove pseudo footer
        embed.fields.push(createStarboardPseudoFooterForMessage_1.createStarboardPseudoFooterForMessage(starboard, originalMessage, starEmoji, starCount)); // Create new pseudo footer
        starboardMessage.edit({ embed });
    }, DEBOUNCE_DELAY);
}
exports.updateStarboardMessageStarCount = updateStarboardMessageStarCount;
