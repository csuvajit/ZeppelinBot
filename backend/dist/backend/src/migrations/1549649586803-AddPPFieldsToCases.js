"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPPFieldsToCases1549649586803 = void 0;
class AddPPFieldsToCases1549649586803 {
    async up(queryRunner) {
        await queryRunner.query(`
        ALTER TABLE \`cases\`
          ADD COLUMN \`pp_id\` BIGINT NULL,
          ADD COLUMN \`pp_name\` VARCHAR(128) NULL
      `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
        ALTER TABLE \`cases\`
          DROP COLUMN \`pp_id\`,
          DROP COLUMN \`pp_name\`
      `);
    }
}
exports.AddPPFieldsToCases1549649586803 = AddPPFieldsToCases1549649586803;
