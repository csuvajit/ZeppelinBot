"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexToArchivesExpiresAt1547392046629 = void 0;
const typeorm_1 = require("typeorm");
class AddIndexToArchivesExpiresAt1547392046629 {
    async up(queryRunner) {
        await queryRunner.createIndex("archives", new typeorm_1.TableIndex({
            columnNames: ["expires_at"],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex("archives", new typeorm_1.TableIndex({
            columnNames: ["expires_at"],
        }));
    }
}
exports.AddIndexToArchivesExpiresAt1547392046629 = AddIndexToArchivesExpiresAt1547392046629;
