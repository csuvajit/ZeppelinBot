"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessagesTable1543053430712 = void 0;
const typeorm_1 = require("typeorm");
class CreateMessagesTable1543053430712 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "messages",
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    unsigned: true,
                    isPrimary: true,
                },
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
                    name: "is_bot",
                    type: "tinyint",
                    unsigned: true,
                },
                {
                    name: "data",
                    type: "mediumtext",
                },
                {
                    name: "posted_at",
                    type: "datetime(3)",
                },
                {
                    name: "deleted_at",
                    type: "datetime(3)",
                    isNullable: true,
                    default: null,
                },
                {
                    name: "is_permanent",
                    type: "tinyint",
                    unsigned: true,
                    default: 0,
                },
            ],
            indices: [
                { columnNames: ["guild_id"] },
                { columnNames: ["channel_id"] },
                { columnNames: ["user_id"] },
                { columnNames: ["is_bot"] },
                { columnNames: ["posted_at"] },
                { columnNames: ["deleted_at"] },
                { columnNames: ["is_permanent"] },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("messages");
    }
}
exports.CreateMessagesTable1543053430712 = CreateMessagesTable1543053430712;
