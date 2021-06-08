"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameAllowedGuildGuildIdToId1561282552734 = void 0;
class RenameAllowedGuildGuildIdToId1561282552734 {
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `allowed_guilds` CHANGE COLUMN `guild_id` `id` BIGINT(20) NOT NULL FIRST;");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `allowed_guilds` CHANGE COLUMN `id` `guild_id` BIGINT(20) NOT NULL FIRST;");
    }
}
exports.RenameAllowedGuildGuildIdToId1561282552734 = RenameAllowedGuildGuildIdToId1561282552734;
