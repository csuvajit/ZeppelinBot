"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSelfGrantableRolesTable1550521627877 = void 0;
const typeorm_1 = require("typeorm");
class CreateSelfGrantableRolesTable1550521627877 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "self_grantable_roles",
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
                    name: "role_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "aliases",
                    type: "varchar",
                    length: "255",
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id", "channel_id", "role_id"],
                    isUnique: true,
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("self_grantable_roles", true);
    }
}
exports.CreateSelfGrantableRolesTable1550521627877 = CreateSelfGrantableRolesTable1550521627877;
