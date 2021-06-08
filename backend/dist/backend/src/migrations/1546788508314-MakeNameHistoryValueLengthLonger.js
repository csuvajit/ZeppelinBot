"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeNameHistoryValueLengthLonger1546788508314 = void 0;
class MakeNameHistoryValueLengthLonger1546788508314 {
    async up(queryRunner) {
        await queryRunner.query(`
        ALTER TABLE \`name_history\`
	        CHANGE COLUMN \`value\` \`value\` VARCHAR(160) NULL DEFAULT NULL COLLATE 'utf8mb4_swedish_ci' AFTER \`type\`;
      `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
        ALTER TABLE \`name_history\`
	        CHANGE COLUMN \`value\` \`value\` VARCHAR(128) NULL DEFAULT NULL COLLATE 'utf8mb4_swedish_ci' AFTER \`type\`;
      `);
    }
}
exports.MakeNameHistoryValueLengthLonger1546788508314 = MakeNameHistoryValueLengthLonger1546788508314;
