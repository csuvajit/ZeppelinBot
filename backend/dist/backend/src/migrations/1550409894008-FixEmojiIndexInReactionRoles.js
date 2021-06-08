"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixEmojiIndexInReactionRoles1550409894008 = void 0;
class FixEmojiIndexInReactionRoles1550409894008 {
    async up(queryRunner) {
        // In utf8mb4_swedish_ci, different native emojis are counted as the same char for indexes, which means we can't
        // have multiple native emojis on a single message since the emoji field is part of the primary key
        await queryRunner.query(`
        ALTER TABLE \`reaction_roles\`
	        CHANGE COLUMN \`emoji\` \`emoji\` VARCHAR(64) NOT NULL COLLATE 'utf8mb4_bin' AFTER \`message_id\`
      `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
        ALTER TABLE \`reaction_roles\`
	        CHANGE COLUMN \`emoji\` \`emoji\` VARCHAR(64) NOT NULL AFTER \`message_id\`
      `);
    }
}
exports.FixEmojiIndexInReactionRoles1550409894008 = FixEmojiIndexInReactionRoles1550409894008;
