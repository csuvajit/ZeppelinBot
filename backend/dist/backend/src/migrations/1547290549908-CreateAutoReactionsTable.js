"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAutoReactionsTable1547290549908 = void 0;
const typeorm_1 = require("typeorm");
class CreateAutoReactionsTable1547290549908 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "auto_reactions",
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
                    name: "reactions",
                    type: "text",
                },
            ],
        }));
        await queryRunner.createPrimaryKey("auto_reactions", ["guild_id", "channel_id"]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable("auto_reactions", true);
    }
}
exports.CreateAutoReactionsTable1547290549908 = CreateAutoReactionsTable1547290549908;
