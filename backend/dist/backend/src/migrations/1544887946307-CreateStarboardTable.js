"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStarboardTable1544887946307 = void 0;
const typeorm_1 = require("typeorm");
class CreateStarboardTable1544887946307 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "starboards",
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
                    name: "channel_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "channel_whitelist",
                    type: "text",
                    isNullable: true,
                    default: null,
                },
                {
                    name: "emoji",
                    type: "varchar",
                    length: "64",
                },
                {
                    name: "reactions_required",
                    type: "smallint",
                    unsigned: true,
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id", "emoji"],
                },
                {
                    columnNames: ["guild_id", "channel_id"],
                    isUnique: true,
                },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: "starboard_messages",
            columns: [
                {
                    name: "starboard_id",
                    type: "int",
                    unsigned: true,
                },
                {
                    name: "message_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "starboard_message_id",
                    type: "bigint",
                    unsigned: true,
                },
            ],
        }));
        await queryRunner.createPrimaryKey("starboard_messages", ["starboard_id", "message_id"]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable("starboards", true);
        await queryRunner.dropTable("starboard_messages", true);
    }
}
exports.CreateStarboardTable1544887946307 = CreateStarboardTable1544887946307;
