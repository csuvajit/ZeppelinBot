"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDashboardUsersTable1558804449510 = void 0;
const typeorm_1 = require("typeorm");
class CreateDashboardUsersTable1558804449510 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "dashboard_users",
            columns: [
                {
                    name: "guild_id",
                    type: "bigint",
                },
                {
                    name: "user_id",
                    type: "bigint",
                },
                {
                    name: "username",
                    type: "varchar",
                    length: "255",
                },
                {
                    name: "role",
                    type: "varchar",
                    length: "32",
                },
            ],
        }));
        await queryRunner.createPrimaryKey("dashboard_users", ["guild_id", "user_id"]);
        await queryRunner.createIndex("dashboard_users", new typeorm_1.TableIndex({
            columnNames: ["user_id"],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("dashboard_users", true);
    }
}
exports.CreateDashboardUsersTable1558804449510 = CreateDashboardUsersTable1558804449510;
