"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLogMessageIdToCases1597015567215 = void 0;
const index_1 = require("typeorm/index");
class AddLogMessageIdToCases1597015567215 {
    async up(queryRunner) {
        await queryRunner.addColumn("cases", new index_1.TableColumn({
            name: "log_message_id",
            type: "varchar",
            length: "64",
            isNullable: true,
            default: null,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("cases", "log_message_id");
    }
}
exports.AddLogMessageIdToCases1597015567215 = AddLogMessageIdToCases1597015567215;
