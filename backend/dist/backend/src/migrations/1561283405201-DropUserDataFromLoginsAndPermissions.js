"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropUserDataFromLoginsAndPermissions1561283405201 = void 0;
class DropUserDataFromLoginsAndPermissions1561283405201 {
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `api_logins` DROP COLUMN `user_data`");
        await queryRunner.query("ALTER TABLE `api_permissions` DROP COLUMN `username`");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `api_logins` ADD COLUMN `user_data` TEXT NOT NULL COLLATE 'utf8mb4_swedish_ci' AFTER `user_id`");
        await queryRunner.query("ALTER TABLE `api_permissions` ADD COLUMN `username` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_swedish_ci' AFTER `user_id`");
    }
}
exports.DropUserDataFromLoginsAndPermissions1561283405201 = DropUserDataFromLoginsAndPermissions1561283405201;
