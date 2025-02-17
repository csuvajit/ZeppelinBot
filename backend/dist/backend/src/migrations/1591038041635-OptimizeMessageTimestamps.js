"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizeMessageTimestamps1591038041635 = void 0;
class OptimizeMessageTimestamps1591038041635 {
    async up(queryRunner) {
        // DATETIME(3) -> DATETIME(0)
        await queryRunner.query(`
        ALTER TABLE \`messages\`
          CHANGE COLUMN \`posted_at\` \`posted_at\` DATETIME(0) NOT NULL AFTER \`data\`,
          CHANGE COLUMN \`deleted_at\` \`deleted_at\` DATETIME(0) NULL DEFAULT NULL AFTER \`posted_at\`
      `);
    }
    async down(queryRunner) {
        // DATETIME(0) -> DATETIME(3)
        await queryRunner.query(`
        ALTER TABLE \`messages\`
          CHANGE COLUMN \`posted_at\` \`posted_at\` DATETIME(3) NOT NULL AFTER \`data\`,
          CHANGE COLUMN \`deleted_at\` \`deleted_at\` DATETIME(3) NULL DEFAULT NULL AFTER \`posted_at\`
      `);
    }
}
exports.OptimizeMessageTimestamps1591038041635 = OptimizeMessageTimestamps1591038041635;
