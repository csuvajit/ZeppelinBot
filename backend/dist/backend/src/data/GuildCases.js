"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildCases = void 0;
const Case_1 = require("./entities/Case");
const CaseNote_1 = require("./entities/CaseNote");
const BaseGuildRepository_1 = require("./BaseGuildRepository");
const typeorm_1 = require("typeorm");
const CaseTypes_1 = require("./CaseTypes");
const db_1 = require("./db");
const CASE_SUMMARY_REASON_MAX_LENGTH = 300;
class GuildCases extends BaseGuildRepository_1.BaseGuildRepository {
    constructor(guildId) {
        super(guildId);
        this.cases = typeorm_1.getRepository(Case_1.Case);
        this.caseNotes = typeorm_1.getRepository(CaseNote_1.CaseNote);
    }
    async get(ids) {
        return this.cases.find({
            relations: this.getRelations(),
            where: {
                guild_id: this.guildId,
                id: typeorm_1.In(ids),
            },
        });
    }
    async find(id) {
        return this.cases.findOne({
            relations: this.getRelations(),
            where: {
                guild_id: this.guildId,
                id,
            },
        });
    }
    async findByCaseNumber(caseNumber) {
        return this.cases.findOne({
            relations: this.getRelations(),
            where: {
                guild_id: this.guildId,
                case_number: caseNumber,
            },
        });
    }
    async findLatestByModId(modId) {
        return this.cases.findOne({
            relations: this.getRelations(),
            where: {
                guild_id: this.guildId,
                mod_id: modId,
            },
            order: {
                case_number: "DESC",
            },
        });
    }
    async findByAuditLogId(auditLogId) {
        return this.cases.findOne({
            relations: this.getRelations(),
            where: {
                guild_id: this.guildId,
                audit_log_id: auditLogId,
            },
        });
    }
    async getByUserId(userId) {
        return this.cases.find({
            relations: this.getRelations(),
            where: {
                guild_id: this.guildId,
                user_id: userId,
            },
        });
    }
    async getTotalCasesByModId(modId) {
        return this.cases.count({
            where: {
                guild_id: this.guildId,
                mod_id: modId,
                is_hidden: 0,
            },
        });
    }
    async getRecentByModId(modId, count, skip = 0) {
        return this.cases.find({
            relations: this.getRelations(),
            where: {
                guild_id: this.guildId,
                mod_id: modId,
                is_hidden: 0,
            },
            skip,
            take: count,
            order: {
                case_number: "DESC",
            },
        });
    }
    async setHidden(id, hidden) {
        await this.cases.update({ id }, {
            is_hidden: hidden,
        });
    }
    async create(data) {
        const result = await this.cases.insert({
            ...data,
            guild_id: this.guildId,
            case_number: () => `(SELECT IFNULL(MAX(case_number)+1, 1) FROM cases AS ma2 WHERE guild_id = ${this.guildId})`,
        });
        return (await this.find(result.identifiers[0].id));
    }
    update(id, data) {
        return this.cases.update(id, data);
    }
    async softDelete(id, deletedById, deletedByName, deletedByText) {
        return db_1.connection.transaction(async (entityManager) => {
            const cases = entityManager.getRepository(Case_1.Case);
            const caseNotes = entityManager.getRepository(CaseNote_1.CaseNote);
            await Promise.all([
                caseNotes.delete({
                    case_id: id,
                }),
                cases.update(id, {
                    user_id: "0",
                    user_name: "Unknown#0000",
                    mod_id: null,
                    mod_name: "Unknown#0000",
                    type: CaseTypes_1.CaseTypes.Deleted,
                    audit_log_id: null,
                    is_hidden: false,
                    pp_id: null,
                    pp_name: null,
                }),
            ]);
            await caseNotes.insert({
                case_id: id,
                mod_id: deletedById,
                mod_name: deletedByName,
                body: deletedByText,
            });
        });
    }
    async createNote(caseId, data) {
        await this.caseNotes.insert({
            ...data,
            case_id: caseId,
        });
    }
}
exports.GuildCases = GuildCases;
