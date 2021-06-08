"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildNicknameHistory = exports.MAX_NICKNAME_ENTRIES_PER_USER = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const NicknameHistoryEntry_1 = require("./entities/NicknameHistoryEntry");
const utils_1 = require("../utils");
const globals_1 = require("../globals");
const nicknames_1 = require("./cleanup/nicknames");
if (!globals_1.isAPI()) {
    const CLEANUP_INTERVAL = 5 * utils_1.MINUTES;
    async function cleanup() {
        await nicknames_1.cleanupNicknames();
        setTimeout(cleanup, CLEANUP_INTERVAL);
    }
    // Start first cleanup 30 seconds after startup
    setTimeout(cleanup, 30 * utils_1.SECONDS);
}
exports.MAX_NICKNAME_ENTRIES_PER_USER = 10;
class GuildNicknameHistory extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.nicknameHistory = typeorm_1.getRepository(NicknameHistoryEntry_1.NicknameHistoryEntry);
    }
    async getByUserId(userId) {
        return this.nicknameHistory.find({
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
            order: {
                id: "DESC",
            },
        });
    }
    getLastEntry(userId) {
        return this.nicknameHistory.findOne({
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
            order: {
                id: "DESC",
            },
        });
    }
    async addEntry(userId, nickname) {
        await this.nicknameHistory.insert({
            guild_id: this.guildId,
            user_id: userId,
            nickname,
        });
        // Cleanup (leave only the last MAX_USERNAME_ENTRIES_PER_USER entries)
        const toDelete = await this.nicknameHistory
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .andWhere("user_id = :userId", { userId })
            .orderBy("id", "DESC")
            .skip(exports.MAX_NICKNAME_ENTRIES_PER_USER)
            .take(99999)
            .getMany();
        if (toDelete.length > 0) {
            await this.nicknameHistory.delete({
                id: typeorm_1.In(toDelete.map(v => v.id)),
            });
        }
    }
}
exports.GuildNicknameHistory = GuildNicknameHistory;
