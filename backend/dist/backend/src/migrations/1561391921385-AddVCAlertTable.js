"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVCAlertTable1561391921385 = void 0;
const typeorm_1 = require("typeorm");
class AddVCAlertTable1561391921385 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "vc_alerts",
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
                    name: "requestor_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "user_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "channel_id",
                    type: "bigint",
                    unsigned: true,
                },
                {
                    name: "expires_at",
                    type: "datetime",
                },
                {
                    name: "body",
                    type: "text",
                },
            ],
            indices: [
                {
                    columnNames: ["guild_id", "user_id"],
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("vc_alerts", true, false, true);
    }
}
exports.AddVCAlertTable1561391921385 = AddVCAlertTable1561391921385;
