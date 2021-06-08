"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSlowmodes = void 0;
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const SlowmodeChannel_1 = require("./entities/SlowmodeChannel");
const SlowmodeUser_1 = require("./entities/SlowmodeUser");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class GuildSlowmodes extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.slowmodeChannels = typeorm_1.getRepository(SlowmodeChannel_1.SlowmodeChannel);
        this.slowmodeUsers = typeorm_1.getRepository(SlowmodeUser_1.SlowmodeUser);
    }
    async getChannelSlowmode(channelId) {
        return this.slowmodeChannels.findOne({
            where: {
                guild_id: this.guildId,
                channel_id: channelId,
            },
        });
    }
    async setChannelSlowmode(channelId, seconds) {
        const existingSlowmode = await this.getChannelSlowmode(channelId);
        if (existingSlowmode) {
            await this.slowmodeChannels.update({
                guild_id: this.guildId,
                channel_id: channelId,
            }, {
                slowmode_seconds: seconds,
            });
        }
        else {
            await this.slowmodeChannels.insert({
                guild_id: this.guildId,
                channel_id: channelId,
                slowmode_seconds: seconds,
            });
        }
    }
    async deleteChannelSlowmode(channelId) {
        await this.slowmodeChannels.delete({
            guild_id: this.guildId,
            channel_id: channelId,
        });
    }
    async getChannelSlowmodeUser(channelId, userId) {
        return this.slowmodeUsers.findOne({
            guild_id: this.guildId,
            channel_id: channelId,
            user_id: userId,
        });
    }
    async userHasSlowmode(channelId, userId) {
        return (await this.getChannelSlowmodeUser(channelId, userId)) != null;
    }
    async addSlowmodeUser(channelId, userId) {
        const slowmode = await this.getChannelSlowmode(channelId);
        if (!slowmode)
            return;
        const expiresAt = moment_timezone_1.default
            .utc()
            .add(slowmode.slowmode_seconds, "seconds")
            .format("YYYY-MM-DD HH:mm:ss");
        if (await this.userHasSlowmode(channelId, userId)) {
            // Update existing
            await this.slowmodeUsers.update({
                guild_id: this.guildId,
                channel_id: channelId,
                user_id: userId,
            }, {
                expires_at: expiresAt,
            });
        }
        else {
            // Add new
            await this.slowmodeUsers.insert({
                guild_id: this.guildId,
                channel_id: channelId,
                user_id: userId,
                expires_at: expiresAt,
            });
        }
    }
    async clearSlowmodeUser(channelId, userId) {
        await this.slowmodeUsers.delete({
            guild_id: this.guildId,
            channel_id: channelId,
            user_id: userId,
        });
    }
    async getChannelSlowmodeUsers(channelId) {
        return this.slowmodeUsers.find({
            where: {
                guild_id: this.guildId,
                channel_id: channelId,
            },
        });
    }
    async getExpiredSlowmodeUsers() {
        return this.slowmodeUsers
            .createQueryBuilder()
            .where("guild_id = :guildId", { guildId: this.guildId })
            .andWhere("expires_at <= NOW()")
            .getMany();
    }
}
exports.GuildSlowmodes = GuildSlowmodes;
