"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCaseNotesForeignKey1596994103885 = void 0;
const index_1 = require("typeorm/index");
class AddCaseNotesForeignKey1596994103885 {
    async up(queryRunner) {
        await queryRunner.createForeignKey("case_notes", new index_1.TableForeignKey({
            name: "case_notes_case_id_fk",
            columnNames: ["case_id"],
            referencedTableName: "cases",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey("case_notes", "case_notes_case_id_fk");
    }
}
exports.AddCaseNotesForeignKey1596994103885 = AddCaseNotesForeignKey1596994103885;
