"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snowflakeToTimestamp = void 0;
const utils_1 = require("../utils");
/**
 * @return Unix timestamp in milliseconds
 */
function snowflakeToTimestamp(snowflake) {
    if (!utils_1.isValidSnowflake(snowflake)) {
        throw new Error(`Invalid snowflake: ${snowflake}`);
    }
    // https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right
    return Number(BigInt(snowflake) >> 22n) + 1420070400000;
}
exports.snowflakeToTimestamp = snowflakeToTimestamp;
