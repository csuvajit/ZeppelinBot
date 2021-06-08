"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixStarboardReactionsIndices1608692857722 = void 0;
const typeorm_1 = require("typeorm");
class FixStarboardReactionsIndices1608692857722 {
    async up(queryRunner) {
        // Remove previously-added duplicate stars
        await queryRunner.query(`
        DELETE r1.* FROM starboard_reactions AS r1
        INNER JOIN starboard_reactions AS r2
          ON r2.guild_id = r1.guild_id AND r2.message_id = r1.message_id AND r2.reactor_id = r1.reactor_id AND r2.id < r1.id
      `);
        await queryRunner.dropIndex("starboard_reactions", "IDX_dd871a4ef459dd294aa368e736");
        await queryRunner.createIndex("starboard_reactions", new typeorm_1.TableIndex({
            isUnique: true,
            columnNames: ["guild_id", "message_id", "reactor_id"],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex("starboard_reactions", "IDX_d08ee47552c92ec8afd1a5bd1b");
        await queryRunner.createIndex("starboard_reactions", new typeorm_1.TableIndex({ columnNames: ["reactor_id", "message_id"] }));
    }
}
exports.FixStarboardReactionsIndices1608692857722 = FixStarboardReactionsIndices1608692857722;
