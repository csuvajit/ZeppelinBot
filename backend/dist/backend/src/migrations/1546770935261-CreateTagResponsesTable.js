"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTagResponsesTable1546770935261 = void 0;
const typeorm_1 = require("typeorm");
class CreateTagResponsesTable1546770935261 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "tag_responses",
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
                    name: "command_message_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "response_message_id",
                    type: "bigint",
                    unsigned: true,
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id"],
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["command_message_id"],
                    referencedTableName: "messages",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    columnNames: ["response_message_id"],
                    referencedTableName: "messages",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("tag_responses");
    }
}
exports.CreateTagResponsesTable1546770935261 = CreateTagResponsesTable1546770935261;
