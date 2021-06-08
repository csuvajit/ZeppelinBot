"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScheduledPostsTable1556973844545 = void 0;
const typeorm_1 = require("typeorm");
class CreateScheduledPostsTable1556973844545 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "scheduled_posts",
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
                    name: "author_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "author_name",
                    type: "varchar",
                    length: "160",
                },
                {
                    name: "channel_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "content",
                    type: "text",
                },
                {
                    name: "attachments",
                    type: "text",
                },
                {
                    name: "post_at",
                    type: "datetime",
                },
                {
                    name: "enable_mentions",
                    type: "tinyint",
                    unsigned: true,
                    default: 0,
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id", "post_at"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("scheduled_posts", true);
    }
}
exports.CreateScheduledPostsTable1556973844545 = CreateScheduledPostsTable1556973844545;
