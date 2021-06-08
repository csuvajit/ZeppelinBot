"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildStarboardReactions = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const StarboardReaction_1 = require("./entities/StarboardReaction");
class GuildStarboardReactions extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.allStarboardReactions = typeorm_1.getRepository(StarboardReaction_1.StarboardReaction);
    }
    async getAllReactionsForMessageId(messageId) {
        return this.allStarboardReactions
            .createQueryBuilder()
            .where("guild_id = :gid", { gid: this.guildId })
            .andWhere("message_id = :msgid", { msgid: messageId })
            .getMany();
    }
    async createStarboardReaction(messageId, reactorId) {
        const existingReaction = await this.allStarboardReactions.findOne({
            where: {
                guild_id: this.guildId,
                message_id: messageId,
                reactor_id: reactorId,
            },
        });
        if (existingReaction) {
            return;
        }
        await this.allStarboardReactions.insert({
            guild_id: this.guildId,
            message_id: messageId,
            reactor_id: reactorId,
        });
    }
    async deleteAllStarboardReactionsForMessageId(messageId) {
        await this.allStarboardReactions.delete({
            guild_id: this.guildId,
            message_id: messageId,
        });
    }
    async deleteStarboardReaction(messageId, reactorId) {
        await this.allStarboardReactions.delete({
            guild_id: this.guildId,
            reactor_id: reactorId,
            message_id: messageId,
        });
    }
}
exports.GuildStarboardReactions = GuildStarboardReactions;
