"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildScheduledPosts = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const ScheduledPost_1 = require("./entities/ScheduledPost");
class GuildScheduledPosts extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.scheduledPosts = typeorm_1.getRepository(ScheduledPost_1.ScheduledPost);
    }
    all() {
        return this.scheduledPosts
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .getMany();
    }
    getDueScheduledPosts() {
        return this.scheduledPosts
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .andWhere("post_at <= NOW()")
            .getMany();
    }
    async delete(id) {
        await this.scheduledPosts.delete({
            guild_id: this.guildId,
            id,
        });
    }
    async create(data) {
        await this.scheduledPosts.insert({
            ...data,
            guild_id: this.guildId,
        });
    }
    async update(id, data) {
        await this.scheduledPosts.update(id, data);
    }
}
exports.GuildScheduledPosts = GuildScheduledPosts;
