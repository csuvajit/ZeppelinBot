"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveStarboardsToConfig1573248462469 = void 0;
const typeorm_1 = require("typeorm");
class MoveStarboardsToConfig1573248462469 {
    async up(queryRunner) {
        // Create the new column for the channels id
        const chanid_column = new typeorm_1.TableColumn({
            name: "starboard_channel_id",
            type: "bigint",
            unsigned: true,
        });
        await queryRunner.addColumn("starboard_messages", chanid_column);
        // Since we are removing the guild_id with the starboards table, we might want it here
        const guid_column = new typeorm_1.TableColumn({
            name: "guild_id",
            type: "bigint",
            unsigned: true,
        });
        await queryRunner.addColumn("starboard_messages", guid_column);
        // Migrate the old starboard_id to the new starboard_channel_id
        await queryRunner.query(`
            UPDATE starboard_messages AS sm
            JOIN starboards AS sb
            ON sm.starboard_id = sb.id
            SET sm.starboard_channel_id = sb.channel_id, sm.guild_id = sb.guild_id;
            `);
        // Drop the starboard_id column as it is now obsolete
        await queryRunner.dropColumn("starboard_messages", "starboard_id");
        // Set new Primary Key
        await queryRunner.dropPrimaryKey("starboard_messages");
        await queryRunner.createPrimaryKey("starboard_messages", ["starboard_message_id"]);
        // Finally, drop the starboards channel as it is now obsolete
        await queryRunner.dropTable("starboards", true);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("starboard_messages", "starboard_channel_id");
        await queryRunner.dropColumn("starboard_messages", "guild_id");
        const sbId = new typeorm_1.TableColumn({
            name: "starboard_id",
            type: "int",
            unsigned: true,
        });
        await queryRunner.addColumn("starboard_messages", sbId);
        await queryRunner.dropPrimaryKey("starboard_messages");
        await queryRunner.createPrimaryKey("starboard_messages", ["starboard_id", "message_id"]);
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
    }
}
exports.MoveStarboardsToConfig1573248462469 = MoveStarboardsToConfig1573248462469;
