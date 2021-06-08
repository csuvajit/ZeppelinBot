"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNameHistoryTable1546778415930 = void 0;
const typeorm_1 = require("typeorm");
class CreateNameHistoryTable1546778415930 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "name_history",
            columns: [
                {
                    name: "id",
                    type: "int",
                    unsigned: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                    isPrimary: true,
                },
                {
                    name: "guild_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "user_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "type",
                    type: "tinyint",
                    unsigned: true,
                },
                {
                    name: "value",
                    type: "varchar",
                    length: "128",
                    isNullable: true,
                },
                {
                    name: "timestamp",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id", "user_id"],
                },
                {
                    columnNames: ["type"],
                },
                {
                    columnNames: ["timestamp"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("name_history");
    }
}
exports.CreateNameHistoryTable1546778415930 = CreateNameHistoryTable1546778415930;
