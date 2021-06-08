"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupMessages = void 0;
const utils_1 = require("../../utils");
const typeorm_1 = require("typeorm");
const SavedMessage_1 = require("../entities/SavedMessage");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = require("../db");
/**
 * How long message edits, deletions, etc. will include the original message content.
 * This is very heavy storage-wise, so keeping it as low as possible is ideal.
 */
const RETENTION_PERIOD = 1 * utils_1.DAYS;
const BOT_MESSAGE_RETENTION_PERIOD = 30 * utils_1.MINUTES;
const DELETED_MESSAGE_RETENTION_PERIOD = 5 * utils_1.MINUTES;
const CLEAN_PER_LOOP = 500;
async function cleanupMessages() {
    let cleaned = 0;
    const messagesRepository = typeorm_1.getRepository(SavedMessage_1.SavedMessage);
    const deletedAtThreshold = moment_timezone_1.default
        .utc()
        .subtract(DELETED_MESSAGE_RETENTION_PERIOD, "ms")
        .format(utils_1.DBDateFormat);
    const postedAtThreshold = moment_timezone_1.default
        .utc()
        .subtract(RETENTION_PERIOD, "ms")
        .format(utils_1.DBDateFormat);
    const botPostedAtThreshold = moment_timezone_1.default
        .utc()
        .subtract(BOT_MESSAGE_RETENTION_PERIOD, "ms")
        .format(utils_1.DBDateFormat);
    // SELECT + DELETE messages in batches
    // This is to avoid deadlocks that happened frequently when deleting with the same criteria as the select below
    // when a message was being inserted at the same time
    let rows;
    do {
        rows = await db_1.connection.query(`
      SELECT id
      FROM messages
      WHERE (
          deleted_at IS NOT NULL
          AND deleted_at <= ?
        )
         OR (
          posted_at <= ?
          AND is_permanent = 0
        )
         OR (
          is_bot = 1
          AND posted_at <= ?
          AND is_permanent = 0
        )
      LIMIT ${CLEAN_PER_LOOP}
    `, [deletedAtThreshold, postedAtThreshold, botPostedAtThreshold]);
        if (rows.length > 0) {
            await messagesRepository.delete({
                id: typeorm_1.In(rows.map(r => r.id)),
            });
        }
        cleaned += rows.length;
    } while (rows.length === CLEAN_PER_LOOP);
    return cleaned;
}
exports.cleanupMessages = cleanupMessages;
