"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDashboardLoginsTable1558804433320 = void 0;
const typeorm_1 = require("typeorm");
class CreateDashboardLoginsTable1558804433320 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "dashboard_logins",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    collation: "ascii_bin",
                },
                {
                    name: "token",
                    type: "varchar",
                    length: "64",
                    collation: "ascii_bin",
                },
                {
                    name: "user_id",
                    type: "bigint",
                },
                {
                    name: "user_data",
                    type: "text",
                },
                {
                    name: "logged_in_at",
                    type: "DATETIME",
                },
                {
                    name: "expires_at",
                    type: "DATETIME",
                },
            ],
            indices: [
                {
                    columnNames: ["user_id"],
                },
                {
                    columnNames: ["expires_at"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("dashboard_logins", true);
    }
}
exports.CreateDashboardLoginsTable1558804433320 = CreateDashboardLoginsTable1558804433320;
