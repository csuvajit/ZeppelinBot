"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStarboardPseudoFooterForMessage = void 0;
const utils_1 = require("../../../utils");
function createStarboardPseudoFooterForMessage(starboard, msg, starEmoji, starCount) {
    const jumpLink = `[Jump to message](${utils_1.messageLink(msg)})`;
    let content;
    if (starboard.show_star_count) {
        content =
            starCount > 1
                ? `${starEmoji} **${starCount}** \u200B \u200B \u200B ${jumpLink}`
                : `${starEmoji} \u200B ${jumpLink}`;
    }
    else {
        content = jumpLink;
    }
    return {
        name: utils_1.EMPTY_CHAR,
        value: content,
    };
}
exports.createStarboardPseudoFooterForMessage = createStarboardPseudoFooterForMessage;
