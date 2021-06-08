"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMemberTimezonesTable1597109357201 = void 0;
const index_1 = require("typeorm/index");
class CreateMemberTimezonesTable1597109357201 {
    async up(queryRunner) {
        await queryRunner.createTable(new index_1.Table({
            name: "member_timezones",
            columns: [
                {
                    name: "guild_id",
                    type: "bigint",
                    isPrimary: true,
                },
                {
                    name: "member_id",
                    type: "bigint",
                    isPrimary: true,
                },
                {
                    name: "timezone",
                    type: "varchar",
                    length: "255",
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("member_timezones");
    }
}
exports.CreateMemberTimezonesTable1597109357201 = CreateMemberTimezonesTable1597109357201;
