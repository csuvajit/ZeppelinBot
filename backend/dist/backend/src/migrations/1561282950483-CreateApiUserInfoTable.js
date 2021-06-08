"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateApiUserInfoTable1561282950483 = void 0;
const typeorm_1 = require("typeorm");
class CreateApiUserInfoTable1561282950483 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "api_user_info",
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    isPrimary: true,
                },
                {
                    name: "data",
                    type: "text",
                },
                {
                    name: "updated_at",
                    type: "datetime",
                    default: "now()",
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("api_user_info", true);
    }
}
exports.CreateApiUserInfoTable1561282950483 = CreateApiUserInfoTable1561282950483;
