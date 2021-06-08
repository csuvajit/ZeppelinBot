"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildReactionRoles = void 0;
const ReactionRole_1 = require("./entities/ReactionRole");
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
class GuildReactionRoles extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.reactionRoles = typeorm_1.getRepository(ReactionRole_1.ReactionRole);
    }
    async all() {
        return this.reactionRoles.find({
            where: {
                guild_id: this.guildId,
            },
        });
    }
    async getForMessage(messageId) {
        return this.reactionRoles.find({
            where: {
                guild_id: this.guildId,
                message_id: messageId,
            },
        });
    }
    async getByMessageAndEmoji(messageId, emoji) {
        return this.reactionRoles.findOne({
            where: {
                guild_id: this.guildId,
                message_id: messageId,
                emoji,
            },
        });
    }
    async removeFromMessage(messageId, emoji) {
        const criteria = {
            guild_id: this.guildId,
            message_id: messageId,
        };
        if (emoji) {
            criteria.emoji = emoji;
        }
        await this.reactionRoles.delete(criteria);
    }
    async add(channelId, messageId, emoji, roleId, exclusive) {
        await this.reactionRoles.insert({
            guild_id: this.guildId,
            channel_id: channelId,
            message_id: messageId,
            emoji,
            role_id: roleId,
            is_exclusive: Boolean(exclusive),
        });
    }
}
exports.GuildReactionRoles = GuildReactionRoles;
