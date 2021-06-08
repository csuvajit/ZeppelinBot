"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsernameHistoryTable1556908589679 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsernameHistoryTable1556908589679 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "username_history",
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
                    name: "user_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "username",
                    type: "varchar",
                    length: "160",
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
                    columnNames: ["user_id"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("username_history", true);
    }
}
exports.CreateUsernameHistoryTable1556908589679 = CreateUsernameHistoryTable1556908589679;
