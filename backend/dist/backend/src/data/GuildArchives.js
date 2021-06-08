"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildArchives = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const ArchiveEntry_1 = require("./entities/ArchiveEntry");
const typeorm_1 = require("typeorm");
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const utils_1 = require("../utils");
const templateFormatter_1 = require("../templateFormatter");
const DEFAULT_EXPIRY_DAYS = 30;
const MESSAGE_ARCHIVE_HEADER_FORMAT = utils_1.trimLines(`
  Server: {guild.name} ({guild.id})
`);
const MESSAGE_ARCHIVE_MESSAGE_FORMAT = "[#{channel.name}] [{user.id}] [{timestamp}] {user.username}#{user.discriminator}: {content}{attachments}";
class GuildArchives extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.archives = typeorm_1.getRepository(ArchiveEntry_1.ArchiveEntry);
        // Clean expired archives at start and then every hour
        this.deleteExpiredArchives();
        setInterval(() => this.deleteExpiredArchives(), 1000 * 60 * 60);
    }
    deleteExpiredArchives() {
        this.archives
            .createQueryBuilder()
            .where("guild_id = :guild_id", { guild_id: this.guildId })
            .andWhere("expires_at IS NOT NULL")
            .andWhere("expires_at <= NOW()")
            .delete()
            .execute();
    }
    async find(id) {
        return this.archives.findOne({
            where: { id },
            relations: this.getRelations(),
        });
    }
    async makePermanent(id) {
        await this.archives.update({ id }, {
            expires_at: null,
        });
    }
    /**
     * @returns ID of the created entry
     */
    async create(body, expiresAt) {
        if (!expiresAt) {
            expiresAt = moment_timezone_1.default.utc().add(DEFAULT_EXPIRY_DAYS, "days");
        }
        const result = await this.archives.insert({
            guild_id: this.guildId,
            body,
            expires_at: expiresAt.format("YYYY-MM-DD HH:mm:ss"),
        });
        return result.identifiers[0].id;
    }
    async renderLinesFromSavedMessages(savedMessages, guild) {
        const msgLines = [];
        for (const msg of savedMessages) {
            const channel = guild.channels.get(msg.channel_id);
            const user = { ...msg.data.author, id: msg.user_id };
            const line = await templateFormatter_1.renderTemplate(MESSAGE_ARCHIVE_MESSAGE_FORMAT, {
                id: msg.id,
                timestamp: moment_timezone_1.default.utc(msg.posted_at).format("YYYY-MM-DD HH:mm:ss"),
                content: msg.data.content,
                user,
                channel,
            });
            msgLines.push(line);
        }
        return msgLines;
    }
    async createFromSavedMessages(savedMessages, guild, expiresAt) {
        if (expiresAt == null) {
            expiresAt = moment_timezone_1.default.utc().add(DEFAULT_EXPIRY_DAYS, "days");
        }
        const headerStr = await templateFormatter_1.renderTemplate(MESSAGE_ARCHIVE_HEADER_FORMAT, { guild });
        const msgLines = await this.renderLinesFromSavedMessages(savedMessages, guild);
        const messagesStr = msgLines.join("\n");
        return this.create([headerStr, messagesStr].join("\n\n"), expiresAt);
    }
    async addSavedMessagesToArchive(archiveId, savedMessages, guild) {
        const msgLines = await this.renderLinesFromSavedMessages(savedMessages, guild);
        const messagesStr = msgLines.join("\n");
        const archive = await this.find(archiveId);
        if (archive == null) {
            throw new Error("Archive not found");
        }
        archive.body += "\n" + messagesStr;
        await this.archives.update({ id: archiveId }, { body: archive.body });
    }
    getUrl(baseUrl, archiveId) {
        return baseUrl ? `${baseUrl}/archives/${archiveId}` : `Archive ID: ${archiveId}`;
    }
}
exports.GuildArchives = GuildArchives;
