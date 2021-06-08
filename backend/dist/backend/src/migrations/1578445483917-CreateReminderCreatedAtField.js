"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReminderCreatedAtField1578445483917 = void 0;
const typeorm_1 = require("typeorm");
class CreateReminderCreatedAtField1578445483917 {
    async up(queryRunner) {
        await queryRunner.addColumn("reminders", new typeorm_1.TableColumn({
            name: "created_at",
            type: "datetime",
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("reminders", "created_at");
    }
}
exports.CreateReminderCreatedAtField1578445483917 = CreateReminderCreatedAtField1578445483917;
