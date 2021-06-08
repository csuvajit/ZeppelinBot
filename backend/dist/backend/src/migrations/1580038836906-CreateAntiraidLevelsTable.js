"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAntiraidLevelsTable1580038836906 = void 0;
const typeorm_1 = require("typeorm");
class CreateAntiraidLevelsTable1580038836906 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "antiraid_levels",
            columns: [
                {
                    name: "guild_id",
                    type: "bigint",
                    unsigned: true,
                    isPrimary: true,
                },
                {
                    name: "level",
                    type: "varchar",
                    length: "64",
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("antiraid_levels");
    }
}
exports.CreateAntiraidLevelsTable1580038836906 = CreateAntiraidLevelsTable1580038836906;
