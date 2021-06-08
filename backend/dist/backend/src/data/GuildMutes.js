"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMutes = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Mute_1 = require("./entities/Mute");
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
class GuildMutes extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.mutes = typeorm_1.getRepository(Mute_1.Mute);
    }
    async getExpiredMutes() {
        return this.mutes
            .createQueryBuilder("mutes")
            .where("guild_id = :guild_id", { guild_id: this.guildId })
            .andWhere("expires_at IS NOT NULL")
            .andWhere("expires_at <= NOW()")
            .getMany();
    }
    async findExistingMuteForUserId(userId) {
        return this.mutes.findOne({
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
        });
    }
    async isMuted(userId) {
        const mute = await this.findExistingMuteForUserId(userId);
        return mute != null;
    }
    async addMute(userId, expiryTime, rolesToRestore) {
        const expiresAt = expiryTime
            ? moment_timezone_1.default
                .utc()
                .add(expiryTime, "ms")
                .format("YYYY-MM-DD HH:mm:ss")
            : null;
        const result = await this.mutes.insert({
            guild_id: this.guildId,
            user_id: userId,
            expires_at: expiresAt,
            roles_to_restore: rolesToRestore ?? [],
        });
        return (await this.mutes.findOne({ where: result.identifiers[0] }));
    }
    async updateExpiryTime(userId, newExpiryTime, rolesToRestore) {
        const expiresAt = newExpiryTime
            ? moment_timezone_1.default
                .utc()
                .add(newExpiryTime, "ms")
                .format("YYYY-MM-DD HH:mm:ss")
            : null;
        if (rolesToRestore && rolesToRestore.length) {
            return this.mutes.update({
                guild_id: this.guildId,
                user_id: userId,
            }, {
                expires_at: expiresAt,
                roles_to_restore: rolesToRestore,
            });
        }
        else {
            return this.mutes.update({
                guild_id: this.guildId,
                user_id: userId,
            }, {
                expires_at: expiresAt,
            });
        }
    }
    async getActiveMutes() {
        return this.mutes
            .createQueryBuilder("mutes")
            .where("guild_id = :guild_id", { guild_id: this.guildId })
            .andWhere(new typeorm_1.Brackets(qb => {
            qb.where("expires_at > NOW()").orWhere("expires_at IS NULL");
        }))
            .getMany();
    }
    async setCaseId(userId, caseId) {
        await this.mutes.update({
            guild_id: this.guildId,
            user_id: userId,
        }, {
            case_id: caseId,
        });
    }
    async clear(userId) {
        await this.mutes.delete({
            guild_id: this.guildId,
            user_id: userId,
        });
    }
}
exports.GuildMutes = GuildMutes;
