"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRepeatColumnsToScheduledPosts1575230079526 = void 0;
const typeorm_1 = require("typeorm");
class AddRepeatColumnsToScheduledPosts1575230079526 {
    async up(queryRunner) {
        await queryRunner.addColumns("scheduled_posts", [
            new typeorm_1.TableColumn({
                name: "repeat_interval",
                type: "integer",
                unsigned: true,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: "repeat_until",
                type: "datetime",
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: "repeat_times",
                type: "integer",
                unsigned: true,
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("scheduled_posts", "repeat_interval");
        await queryRunner.dropColumn("scheduled_posts", "repeat_until");
        await queryRunner.dropColumn("scheduled_posts", "repeat_times");
    }
}
exports.AddRepeatColumnsToScheduledPosts1575230079526 = AddRepeatColumnsToScheduledPosts1575230079526;
