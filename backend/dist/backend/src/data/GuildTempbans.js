"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildTempbans = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const Tempban_1 = require("./entities/Tempban");
class GuildTempbans extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.tempbans = typeorm_1.getRepository(Tempban_1.Tempban);
    }
    async getExpiredTempbans() {
        return this.tempbans
            .createQueryBuilder("mutes")
            .where("guild_id = :guild_id", { guild_id: this.guildId })
            .andWhere("expires_at IS NOT NULL")
            .andWhere("expires_at <= NOW()")
            .getMany();
    }
    async findExistingTempbanForUserId(userId) {
        return this.tempbans.findOne({
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
        });
    }
    async addTempban(userId, expiryTime, modId) {
        const expiresAt = moment_timezone_1.default
            .utc()
            .add(expiryTime, "ms")
            .format("YYYY-MM-DD HH:mm:ss");
        const result = await this.tempbans.insert({
            guild_id: this.guildId,
            user_id: userId,
            mod_id: modId,
            expires_at: expiresAt,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
        });
        return (await this.tempbans.findOne({ where: result.identifiers[0] }));
    }
    async updateExpiryTime(userId, newExpiryTime, modId) {
        const expiresAt = moment_timezone_1.default
            .utc()
            .add(newExpiryTime, "ms")
            .format("YYYY-MM-DD HH:mm:ss");
        return this.tempbans.update({
            guild_id: this.guildId,
            user_id: userId,
        }, {
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            expires_at: expiresAt,
            mod_id: modId,
        });
    }
    async clear(userId) {
        await this.tempbans.delete({
            guild_id: this.guildId,
            user_id: userId,
        });
    }
}
exports.GuildTempbans = GuildTempbans;
