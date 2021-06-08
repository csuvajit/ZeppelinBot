"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameHistory = exports.MAX_USERNAME_ENTRIES_PER_USER = void 0;
const typeorm_1 = require("typeorm");
const UsernameHistoryEntry_1 = require("./entities/UsernameHistoryEntry");
const utils_1 = require("../utils");
const BaseRepository_1 = require("./BaseRepository");
const globals_1 = require("../globals");
const usernames_1 = require("./cleanup/usernames");
if (!globals_1.isAPI()) {
    const CLEANUP_INTERVAL = 5 * utils_1.MINUTES;
    async function cleanup() {
        await usernames_1.cleanupUsernames();
        setTimeout(cleanup, CLEANUP_INTERVAL);
    }
    // Start first cleanup 30 seconds after startup
    setTimeout(cleanup, 30 * utils_1.SECONDS);
}
exports.MAX_USERNAME_ENTRIES_PER_USER = 5;
class UsernameHistory extends BaseRepository_1.BaseRepository {
    constructor() {
        super();
        this.usernameHistory = typeorm_1.getRepository(UsernameHistoryEntry_1.UsernameHistoryEntry);
    }
    async getByUserId(userId) {
        return this.usernameHistory.find({
            where: {
                user_id: userId,
            },
            order: {
                id: "DESC",
            },
            take: exports.MAX_USERNAME_ENTRIES_PER_USER,
        });
    }
    getLastEntry(userId) {
        return this.usernameHistory.findOne({
            where: {
                user_id: userId,
            },
            order: {
                id: "DESC",
            },
        });
    }
    async addEntry(userId, username) {
        await this.usernameHistory.insert({
            user_id: userId,
            username,
        });
        // Cleanup (leave only the last MAX_USERNAME_ENTRIES_PER_USER entries)
        const toDelete = await this.usernameHistory
            .createQueryBuilder()
            .where("user_id = :userId", { userId })
            .orderBy("id", "DESC")
            .skip(exports.MAX_USERNAME_ENTRIES_PER_USER)
            .take(99999)
            .getMany();
        if (toDelete.length > 0) {
            await this.usernameHistory.delete({
                id: typeorm_1.In(toDelete.map(v => v.id)),
            });
        }
    }
}
exports.UsernameHistory = UsernameHistory;
