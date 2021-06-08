"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTempBansTable1608753440716 = void 0;
const typeorm_1 = require("typeorm");
class CreateTempBansTable1608753440716 {
    async up(queryRunner) {
        const table = await queryRunner.createTable(new typeorm_1.Table({
            name: "tempbans",
            columns: [
                {
                    name: "guild_id",
                    type: "bigint",
                    isPrimary: true,
                },
                {
                    name: "user_id",
                    type: "bigint",
                    isPrimary: true,
                },
                {
                    name: "mod_id",
                    type: "bigint",
                },
                {
                    name: "created_at",
                    type: "datetime",
                },
                {
                    name: "expires_at",
                    type: "datetime",
                },
            ],
        }));
        queryRunner.createIndex("tempbans", new typeorm_1.TableIndex({
            columnNames: ["expires_at"],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("tempbans");
    }
}
exports.CreateTempBansTable1608753440716 = CreateTempBansTable1608753440716;
