"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAllowedGuildsTable1561117545258 = void 0;
const typeorm_1 = require("typeorm");
class CreateAllowedGuildsTable1561117545258 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "allowed_guilds",
            columns: [
                {
                    name: "guild_id",
                    type: "bigint",
                    isPrimary: true,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                },
                {
                    name: "icon",
                    type: "varchar",
                    length: "255",
                    collation: "ascii_general_ci",
                    isNullable: true,
                },
                {
                    name: "owner_id",
                    type: "bigint",
                },
            ],
            indices: [{ columnNames: ["owner_id"] }],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("allowed_guilds", true);
    }
}
exports.CreateAllowedGuildsTable1561117545258 = CreateAllowedGuildsTable1561117545258;
