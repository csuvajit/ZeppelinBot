"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCounterTriggers1617363975046 = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("typeorm/index");
class UpdateCounterTriggers1617363975046 {
    async up(queryRunner) {
        // Since we're adding a non-nullable unique name column and existing triggers won't have that, clear the table first
        await queryRunner.query("DELETE FROM counter_triggers");
        await queryRunner.addColumns("counter_triggers", [
            new typeorm_1.TableColumn({
                name: "name",
                type: "varchar",
                length: "255",
            }),
            new typeorm_1.TableColumn({
                name: "reverse_comparison_op",
                type: "varchar",
                length: "16",
            }),
            new typeorm_1.TableColumn({
                name: "reverse_comparison_value",
                type: "int",
            }),
        ]);
        // Drop foreign key for counter_id -- needed to be able to drop the following unique index
        await queryRunner.dropForeignKey("counter_triggers", "FK_6bb47849ec95c87e58c5d3e6ae1");
        // Index for ["counter_id", "comparison_op", "comparison_value"]
        await queryRunner.dropIndex("counter_triggers", "IDX_ddc8a6701f1234b926d35aebf3");
        await queryRunner.createIndex("counter_triggers", new typeorm_1.TableIndex({
            columnNames: ["counter_id", "name"],
            isUnique: true,
        }));
        // Recreate foreign key for counter_id
        await queryRunner.createForeignKey("counter_triggers", new index_1.TableForeignKey({
            columnNames: ["counter_id"],
            referencedTableName: "counters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }
    async down(queryRunner) {
        // Since we're going back to unique comparison op and comparison value in this reverse-migration,
        // clear table contents first so we don't run into any conflicts with triggers with different names but identical comparison op and comparison value
        await queryRunner.query("DELETE FROM counter_triggers");
        // Drop foreign key for counter_id -- needed to be able to drop the following unique index
        await queryRunner.dropForeignKey("counter_triggers", "FK_6bb47849ec95c87e58c5d3e6ae1");
        // Index for ["counter_id", "name"]
        await queryRunner.dropIndex("counter_triggers", "IDX_2ec128e1d74bedd0288b60cdd1");
        await queryRunner.createIndex("counter_triggers", new typeorm_1.TableIndex({
            columnNames: ["counter_id", "comparison_op", "comparison_value"],
            isUnique: true,
        }));
        // Recreate foreign key for counter_id
        await queryRunner.createForeignKey("counter_triggers", new index_1.TableForeignKey({
            columnNames: ["counter_id"],
            referencedTableName: "counters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
        await queryRunner.dropColumn("counter_triggers", "reverse_comparison_value");
        await queryRunner.dropColumn("counter_triggers", "reverse_comparison_op");
        await queryRunner.dropColumn("counter_triggers", "name");
    }
}
exports.UpdateCounterTriggers1617363975046 = UpdateCounterTriggers1617363975046;
