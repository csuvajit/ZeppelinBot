"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberTimezones = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const MemberTimezone_1 = require("./entities/MemberTimezone");
const index_1 = require("typeorm/index");
const db_1 = require("./db");
class GuildMemberTimezones extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.memberTimezones = index_1.getRepository(MemberTimezone_1.MemberTimezone);
    }
    get(memberId) {
        return this.memberTimezones.findOne({
            guild_id: this.guildId,
            member_id: memberId,
        });
    }
    async set(memberId, timezone) {
        await db_1.connection.transaction(async (entityManager) => {
            const repo = entityManager.getRepository(MemberTimezone_1.MemberTimezone);
            const existingRow = await repo.findOne({
                guild_id: this.guildId,
                member_id: memberId,
            });
            if (existingRow) {
                await repo.update({
                    guild_id: this.guildId,
                    member_id: memberId,
                }, {
                    timezone,
                });
            }
            else {
                await repo.insert({
                    guild_id: this.guildId,
                    member_id: memberId,
                    timezone,
                });
            }
        });
    }
    reset(memberId) {
        return this.memberTimezones.delete({
            guild_id: this.guildId,
            member_id: memberId,
        });
    }
}
exports.GuildMemberTimezones = GuildMemberTimezones;
