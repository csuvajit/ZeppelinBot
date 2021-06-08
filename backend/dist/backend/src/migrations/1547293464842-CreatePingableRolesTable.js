"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePingableRolesTable1547293464842 = void 0;
const typeorm_1 = require("typeorm");
class CreatePingableRolesTable1547293464842 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "pingable_roles",
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
            ],
            indices: [
                {
                    columnNames: ["guild_id", "channel_id"],
                },
                {
                    columnNames: ["guild_id", "channel_id", "role_id"],
                    isUnique: true,
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("pingable_roles", true);
    }
}
exports.CreatePingableRolesTable1547293464842 = CreatePingableRolesTable1547293464842;
