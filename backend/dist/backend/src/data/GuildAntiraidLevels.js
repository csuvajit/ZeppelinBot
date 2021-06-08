"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildAntiraidLevels = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const AntiraidLevel_1 = require("./entities/AntiraidLevel");
class GuildAntiraidLevels extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.antiraidLevels = typeorm_1.getRepository(AntiraidLevel_1.AntiraidLevel);
    }
    async get() {
        const row = await this.antiraidLevels.findOne({
            where: {
                guild_id: this.guildId,
            },
        });
        return row?.level ?? null;
    }
    async set(level) {
        if (level === null) {
            await this.antiraidLevels.delete({
                guild_id: this.guildId,
            });
        }
        else {
            // Upsert: https://stackoverflow.com/a/47064558/316944
            // But the MySQL version: https://github.com/typeorm/typeorm/issues/1090#issuecomment-634391487
            await this.antiraidLevels
                .createQueryBuilder()
                .insert()
                .values({
                guild_id: this.guildId,
                level,
            })
                .orUpdate({
                conflict_target: ["guild_id"],
                overwrite: ["level"],
            })
                .execute();
        }
    }
}
exports.GuildAntiraidLevels = GuildAntiraidLevels;
