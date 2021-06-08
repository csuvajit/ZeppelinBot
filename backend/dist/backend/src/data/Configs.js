"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configs = void 0;
const Config_1 = require("./entities/Config");
const typeorm_1 = require("typeorm");
const db_1 = require("./db");
const BaseRepository_1 = require("./BaseRepository");
const globals_1 = require("../globals");
const utils_1 = require("../utils");
const configs_1 = require("./cleanup/configs");
if (globals_1.isAPI()) {
    const CLEANUP_INTERVAL = 1 * utils_1.HOURS;
    async function cleanup() {
        await configs_1.cleanupConfigs();
        setTimeout(cleanup, CLEANUP_INTERVAL);
    }
    // Start first cleanup 30 seconds after startup
    setTimeout(cleanup, 30 * utils_1.SECONDS);
}
class Configs extends BaseRepository_1.BaseRepository {
    constructor() {
        super();
        this.configs = typeorm_1.getRepository(Config_1.Config);
    }
    getActiveByKey(key) {
        return this.configs.findOne({
            where: {
                key,
                is_active: true,
            },
        });
    }
    async getHighestId() {
        const rows = await db_1.connection.query("SELECT MAX(id) AS highest_id FROM configs");
        return (rows.length && rows[0].highest_id) || 0;
    }
    getActiveLargerThanId(id) {
        return this.configs
            .createQueryBuilder()
            .where("id > :id", { id })
            .andWhere("is_active = 1")
            .getMany();
    }
    async hasConfig(key) {
        return (await this.getActiveByKey(key)) != null;
    }
    getRevisions(key, num = 10) {
        return this.configs.find({
            relations: this.getRelations(),
            where: { key },
            select: ["id", "key", "is_active", "edited_by", "edited_at"],
            order: {
                edited_at: "DESC",
            },
            take: num,
        });
    }
    async saveNewRevision(key, config, editedBy) {
        return db_1.connection.transaction(async (entityManager) => {
            const repo = entityManager.getRepository(Config_1.Config);
            // Mark all old revisions inactive
            await repo.update({ key }, { is_active: false });
            // Add new, active revision
            await repo.insert({
                key,
                config,
                is_active: true,
                edited_by: editedBy,
            });
        });
    }
}
exports.Configs = Configs;
