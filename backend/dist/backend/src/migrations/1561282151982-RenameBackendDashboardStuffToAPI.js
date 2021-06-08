"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameBackendDashboardStuffToAPI1561282151982 = void 0;
class RenameBackendDashboardStuffToAPI1561282151982 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE dashboard_users RENAME api_users`);
        await queryRunner.query(`ALTER TABLE dashboard_logins RENAME api_logins`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE api_users RENAME dashboard_users`);
        await queryRunner.query(`ALTER TABLE api_logins RENAME dashboard_logins`);
    }
}
exports.RenameBackendDashboardStuffToAPI1561282151982 = RenameBackendDashboardStuffToAPI1561282151982;
