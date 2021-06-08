"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupUsernames = exports.USERNAME_RETENTION_PERIOD = void 0;
const typeorm_1 = require("typeorm");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const UsernameHistoryEntry_1 = require("../entities/UsernameHistoryEntry");
const utils_1 = require("../../utils");
const db_1 = require("../db");
exports.USERNAME_RETENTION_PERIOD = 30 * utils_1.DAYS;
const CLEAN_PER_LOOP = 500;
async function cleanupUsernames() {
    let cleaned = 0;
    const usernameHistoryRepository = typeorm_1.getRepository(UsernameHistoryEntry_1.UsernameHistoryEntry);
    const dateThreshold = moment_timezone_1.default
        .utc()
        .subtract(exports.USERNAME_RETENTION_PERIOD, "ms")
        .format(utils_1.DBDateFormat);
    // Clean old usernames (USERNAME_RETENTION_PERIOD)
    let rows;
    do {
        rows = await db_1.connection.query(`
      SELECT id
      FROM username_history
      WHERE timestamp < ?
      LIMIT ${CLEAN_PER_LOOP}
    `, [dateThreshold]);
        if (rows.length > 0) {
            await usernameHistoryRepository.delete({
                id: typeorm_1.In(rows.map(r => r.id)),
            });
        }
        cleaned += rows.length;
    } while (rows.length === CLEAN_PER_LOOP);
    return cleaned;
}
exports.cleanupUsernames = cleanupUsernames;
