"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSlowmodeTables1544877081073 = void 0;
const typeorm_1 = require("typeorm");
class CreateSlowmodeTables1544877081073 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "slowmode_channels",
            columns: [
                {
                    name: "guild_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "channel_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "slowmode_seconds",
                    type: "int",
                    unsigned: true,
                },
            ],
            indices: [],
        }));
        await queryRunner.createPrimaryKey("slowmode_channels", ["guild_id", "channel_id"]);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "slowmode_users",
            columns: [
                {
                    name: "guild_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "channel_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "user_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "expires_at",
                    type: "datetime",
                },
            ],
            indices: [
                {
                    columnNames: ["expires_at"],
                },
            ],
        }));
        await queryRunner.createPrimaryKey("slowmode_users", ["guild_id", "channel_id", "user_id"]);
    }
    async down(queryRunner) {
        await Promise.all([
            queryRunner.dropTable("slowmode_channels", true),
            queryRunner.dropTable("slowmode_users", true),
        ]);
    }
}
exports.CreateSlowmodeTables1544877081073 = CreateSlowmodeTables1544877081073;
