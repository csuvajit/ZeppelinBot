"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildVCAlerts = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const VCAlert_1 = require("./entities/VCAlert");
class GuildVCAlerts extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.allAlerts = typeorm_1.getRepository(VCAlert_1.VCAlert);
    }
    async getOutdatedAlerts() {
        return this.allAlerts
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .andWhere("expires_at <= NOW()")
            .getMany();
    }
    async getAllGuildAlerts() {
        return this.allAlerts
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .getMany();
    }
    async getAlertsByUserId(userId) {
        return this.allAlerts.find({
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
        });
    }
    async getAlertsByRequestorId(requestorId) {
        return this.allAlerts.find({
            where: {
                guild_id: this.guildId,
                requestor_id: requestorId,
            },
        });
    }
    async delete(id) {
        await this.allAlerts.delete({
            guild_id: this.guildId,
            id,
        });
    }
    async add(requestorId, userId, channelId, expiresAt, body, active) {
        await this.allAlerts.insert({
            guild_id: this.guildId,
            requestor_id: requestorId,
            user_id: userId,
            channel_id: channelId,
            expires_at: expiresAt,
            body,
            active,
        });
    }
}
exports.GuildVCAlerts = GuildVCAlerts;
