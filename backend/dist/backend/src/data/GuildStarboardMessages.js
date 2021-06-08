"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildStarboardMessages = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const StarboardMessage_1 = require("./entities/StarboardMessage");
class GuildStarboardMessages extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.allStarboardMessages = typeorm_1.getRepository(StarboardMessage_1.StarboardMessage);
    }
    async getStarboardMessagesForMessageId(messageId) {
        return this.allStarboardMessages
            .createQueryBuilder()
            .where("guild_id = :gid", { gid: this.guildId })
            .andWhere("message_id = :msgid", { msgid: messageId })
            .getMany();
    }
    async getStarboardMessagesForStarboardMessageId(starboardMessageId) {
        return this.allStarboardMessages
            .createQueryBuilder()
            .where("guild_id = :gid", { gid: this.guildId })
            .andWhere("starboard_message_id = :messageId", { messageId: starboardMessageId })
            .getMany();
    }
    async getMatchingStarboardMessages(starboardChannelId, sourceMessageId) {
        return this.allStarboardMessages
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .andWhere("message_id = :msgId", { msgId: sourceMessageId })
            .andWhere("starboard_channel_id = :channelId", { channelId: starboardChannelId })
            .getMany();
    }
    async createStarboardMessage(starboardId, messageId, starboardMessageId) {
        await this.allStarboardMessages.insert({
            message_id: messageId,
            starboard_message_id: starboardMessageId,
            starboard_channel_id: starboardId,
            guild_id: this.guildId,
        });
    }
    async deleteStarboardMessage(starboardMessageId, starboardChannelId) {
        await this.allStarboardMessages.delete({
            guild_id: this.guildId,
            starboard_message_id: starboardMessageId,
            starboard_channel_id: starboardChannelId,
        });
    }
}
exports.GuildStarboardMessages = GuildStarboardMessages;
