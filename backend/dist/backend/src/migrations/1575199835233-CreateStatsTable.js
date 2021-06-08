"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStatsTable1575199835233 = void 0;
const typeorm_1 = require("typeorm");
class CreateStatsTable1575199835233 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "stats",
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    unsigned: true,
                    isPrimary: true,
                    generationStrategy: "increment",
                },
                {
                    name: "guild_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "source",
                    type: "varchar",
                    length: "64",
                    collation: "ascii_bin",
                },
                {
                    name: "key",
                    type: "varchar",
                    length: "64",
                    collation: "ascii_bin",
                },
                {
                    name: "value",
                    type: "integer",
                    unsigned: true,
                },
                {
                    name: "created_at",
                    type: "datetime",
                    default: "NOW()",
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id", "source", "key"],
                },
                {
                    columnNames: ["created_at"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("stats");
    }
}
exports.CreateStatsTable1575199835233 = CreateStatsTable1575199835233;
