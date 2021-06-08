"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildPersistedData = void 0;
const PersistedData_1 = require("./entities/PersistedData");
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
class GuildPersistedData extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.persistedData = typeorm_1.getRepository(PersistedData_1.PersistedData);
    }
    async find(userId) {
        return this.persistedData.findOne({
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
        });
    }
    async set(userId, data = {}) {
        const finalData = {};
        if (data.roles)
            finalData.roles = data.roles.join(",");
        if (data.nickname)
            finalData.nickname = data.nickname;
        const existing = await this.find(userId);
        if (existing) {
            await this.persistedData.update({
                guild_id: this.guildId,
                user_id: userId,
            }, finalData);
        }
        else {
            await this.persistedData.insert({
                ...finalData,
                guild_id: this.guildId,
                user_id: userId,
            });
        }
    }
    async clear(userId) {
        await this.persistedData.delete({
            guild_id: this.guildId,
            user_id: userId,
        });
    }
}
exports.GuildPersistedData = GuildPersistedData;
