"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSupportersTable1590616691907 = void 0;
const typeorm_1 = require("typeorm");
class CreateSupportersTable1590616691907 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "supporters",
            columns: [
                {
                    name: "user_id",
                    type: "bigint",
                    unsigned: true,
                    isPrimary: true,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                },
                {
                    name: "amount",
                    type: "decimal",
                    precision: 6,
                    scale: 2,
                    isNullable: true,
                    default: null,
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("supporters");
    }
}
exports.CreateSupportersTable1590616691907 = CreateSupportersTable1590616691907;
