"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildPingableRoles = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const PingableRole_1 = require("./entities/PingableRole");
class GuildPingableRoles extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.pingableRoles = typeorm_1.getRepository(PingableRole_1.PingableRole);
    }
    async all() {
        return this.pingableRoles.find({
            where: {
                guild_id: this.guildId,
            },
        });
    }
    async getForChannel(channelId) {
        return this.pingableRoles.find({
            where: {
                guild_id: this.guildId,
                channel_id: channelId,
            },
        });
    }
    async getByChannelAndRoleId(channelId, roleId) {
        return this.pingableRoles.findOne({
            where: {
                guild_id: this.guildId,
                channel_id: channelId,
                role_id: roleId,
            },
        });
    }
    async delete(channelId, roleId) {
        await this.pingableRoles.delete({
            guild_id: this.guildId,
            channel_id: channelId,
            role_id: roleId,
        });
    }
    async add(channelId, roleId) {
        await this.pingableRoles.insert({
            guild_id: this.guildId,
            channel_id: channelId,
            role_id: roleId,
        });
    }
}
exports.GuildPingableRoles = GuildPingableRoles;
