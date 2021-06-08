"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildStats = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const StatValue_1 = require("./entities/StatValue");
class GuildStats extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.stats = typeorm_1.getRepository(StatValue_1.StatValue);
    }
    async saveValue(source, key, value) {
        await this.stats.insert({
            guild_id: this.guildId,
            source,
            key,
            value,
        });
    }
    async deleteOldValues(source, cutoff) {
        await this.stats
            .createQueryBuilder()
            .where("source = :source", { source })
            .andWhere("created_at < :cutoff", { cutoff })
            .delete();
    }
}
exports.GuildStats = GuildStats;
