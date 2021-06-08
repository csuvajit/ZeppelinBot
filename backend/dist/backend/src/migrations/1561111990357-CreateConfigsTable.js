"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConfigsTable1561111990357 = void 0;
const typeorm_1 = require("typeorm");
class CreateConfigsTable1561111990357 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "configs",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "key",
                    type: "varchar",
                    length: "48",
                },
                {
                    name: "config",
                    type: "mediumtext",
                },
                {
                    name: "is_active",
                    type: "tinyint",
                },
                {
                    name: "edited_by",
                    type: "bigint",
                },
                {
                    name: "edited_at",
                    type: "datetime",
                    default: "now()",
                },
            ],
            indices: [
                {
                    columnNames: ["key", "is_active"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("configs", true);
    }
}
exports.CreateConfigsTable1561111990357 = CreateConfigsTable1561111990357;
