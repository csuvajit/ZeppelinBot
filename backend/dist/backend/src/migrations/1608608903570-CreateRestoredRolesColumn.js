"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRestoredRolesColumn1608608903570 = void 0;
const typeorm_1 = require("typeorm");
class CreateRestoredRolesColumn1608608903570 {
    async up(queryRunner) {
        await queryRunner.addColumn("mutes", new typeorm_1.TableColumn({
            name: "roles_to_restore",
            type: "text",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("mutes", "roles_to_restore");
    }
}
exports.CreateRestoredRolesColumn1608608903570 = CreateRestoredRolesColumn1608608903570;
