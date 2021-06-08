"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildAutoReactions = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const AutoReaction_1 = require("./entities/AutoReaction");
class GuildAutoReactions extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.autoReactions = typeorm_1.getRepository(AutoReaction_1.AutoReaction);
    }
    async all() {
        return this.autoReactions.find({
            where: {
                guild_id: this.guildId,
            },
        });
    }
    async getForChannel(channelId) {
        return this.autoReactions.findOne({
            where: {
                guild_id: this.guildId,
                channel_id: channelId,
            },
        });
    }
    async removeFromChannel(channelId) {
        await this.autoReactions.delete({
            guild_id: this.guildId,
            channel_id: channelId,
        });
    }
    async set(channelId, reactions) {
        const existingRecord = await this.getForChannel(channelId);
        if (existingRecord) {
            this.autoReactions.update({
                guild_id: this.guildId,
                channel_id: channelId,
            }, {
                reactions,
            });
        }
        else {
            await this.autoReactions.insert({
                guild_id: this.guildId,
                channel_id: channelId,
                reactions,
            });
        }
    }
}
exports.GuildAutoReactions = GuildAutoReactions;
