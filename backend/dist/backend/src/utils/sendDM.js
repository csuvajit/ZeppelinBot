"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDM = exports.DMError = void 0;
const utils_1 = require("../utils");
const logger_1 = require("../logger");
let dmsDisabled = false;
let dmsDisabledTimeout;
function disableDMs(duration) {
    dmsDisabled = true;
    clearTimeout(dmsDisabledTimeout);
    dmsDisabledTimeout = setTimeout(() => (dmsDisabled = false), duration);
}
class DMError extends Error {
}
exports.DMError = DMError;
const error20026 = "The bot cannot currently send DMs";
async function sendDM(user, content, source) {
    if (dmsDisabled) {
        throw new DMError(error20026);
    }
    logger_1.logger.debug(`Sending ${source} DM to ${user.id}`);
    try {
        const dmChannel = await user.getDMChannel();
        if (!dmChannel) {
            throw new DMError("Unable to open DM channel");
        }
        if (typeof content === "string") {
            await utils_1.createChunkedMessage(dmChannel, content);
        }
        else {
            await dmChannel.createMessage(content);
        }
    }
    catch (e) {
        if (utils_1.isDiscordRESTError(e) && e.code === 20026) {
            logger_1.logger.warn(`Received error code 20026: ${e.message}`);
            logger_1.logger.warn("Disabling attempts to send DMs for 1 hour");
            disableDMs(1 * utils_1.HOURS);
            throw new DMError(error20026);
        }
        throw e;
    }
}
exports.sendDM = sendDM;
