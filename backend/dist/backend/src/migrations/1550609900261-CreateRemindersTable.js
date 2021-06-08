"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRemindersTable1550609900261 = void 0;
const typeorm_1 = require("typeorm");
class CreateRemindersTable1550609900261 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "reminders",
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
                    name: "channel_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "remind_at",
                    type: "datetime",
                },
                {
                    name: "body",
                    type: "text",
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id", "user_id"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("reminders", true);
    }
}
exports.CreateRemindersTable1550609900261 = CreateRemindersTable1550609900261;
