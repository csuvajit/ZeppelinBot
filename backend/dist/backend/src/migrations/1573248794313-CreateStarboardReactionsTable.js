"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStarboardReactionsTable1573248794313 = void 0;
const typeorm_1 = require("typeorm");
class CreateStarboardReactionsTable1573248794313 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "starboard_reactions",
            columns: [
                {
                    name: "id",
                    type: "int",
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
                    name: "message_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "reactor_id",
                    type: "bigint",
                    unsigned: true,
                },
            ],
            indices: [
                {
                    columnNames: ["reactor_id", "message_id"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("starboard_reactions", true, false, true);
    }
}
exports.CreateStarboardReactionsTable1573248794313 = CreateStarboardReactionsTable1573248794313;
