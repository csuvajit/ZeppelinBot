"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameApiUsersToApiPermissions1561283165823 = void 0;
class RenameApiUsersToApiPermissions1561283165823 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE api_users RENAME api_permissions`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE api_permissions RENAME api_users`);
    }
}
exports.RenameApiUsersToApiPermissions1561283165823 = RenameApiUsersToApiPermissions1561283165823;
