"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildTags = void 0;
const Tag_1 = require("./entities/Tag");
const typeorm_1 = require("typeorm");
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const TagResponse_1 = require("./entities/TagResponse");
class GuildTags extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.tags = typeorm_1.getRepository(Tag_1.Tag);
        this.tagResponses = typeorm_1.getRepository(TagResponse_1.TagResponse);
    }
    async all() {
        return this.tags.find({
            where: {
                guild_id: this.guildId,
            },
        });
    }
    async find(tag) {
        return this.tags.findOne({
            where: {
                guild_id: this.guildId,
                tag,
            },
        });
    }
    async createOrUpdate(tag, body, userId) {
        const existingTag = await this.find(tag);
        if (existingTag) {
            await this.tags
                .createQueryBuilder()
                .update()
                .set({
                body,
                user_id: userId,
                created_at: () => "NOW()",
            })
                .where("guild_id = :guildId", { guildId: this.guildId })
                .andWhere("tag = :tag", { tag })
                .execute();
        }
        else {
            await this.tags.insert({
                guild_id: this.guildId,
                user_id: userId,
                tag,
                body,
            });
        }
    }
    async delete(tag) {
        await this.tags.delete({
            guild_id: this.guildId,
            tag,
        });
    }
    async findResponseByCommandMessageId(messageId) {
        return this.tagResponses.findOne({
            where: {
                guild_id: this.guildId,
                command_message_id: messageId,
            },
        });
    }
    async findResponseByResponseMessageId(messageId) {
        return this.tagResponses.findOne({
            where: {
                guild_id: this.guildId,
                response_message_id: messageId,
            },
        });
    }
    async addResponse(cmdMessageId, responseMessageId) {
        await this.tagResponses.insert({
            guild_id: this.guildId,
            command_message_id: cmdMessageId,
            response_message_id: responseMessageId,
        });
    }
}
exports.GuildTags = GuildTags;
