"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildReminders = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const Reminder_1 = require("./entities/Reminder");
class GuildReminders extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.reminders = typeorm_1.getRepository(Reminder_1.Reminder);
    }
    async getDueReminders() {
        return this.reminders
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .andWhere("remind_at <= NOW()")
            .getMany();
    }
    async getRemindersByUserId(userId) {
        return this.reminders.find({
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
        });
    }
    async delete(id) {
        await this.reminders.delete({
            guild_id: this.guildId,
            id,
        });
    }
    async add(userId, channelId, remindAt, body, created_at) {
        await this.reminders.insert({
            guild_id: this.guildId,
            user_id: userId,
            channel_id: channelId,
            remind_at: remindAt,
            body,
            created_at,
        });
    }
}
exports.GuildReminders = GuildReminders;
