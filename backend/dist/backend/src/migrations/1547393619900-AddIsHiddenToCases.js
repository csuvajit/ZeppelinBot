"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsHiddenToCases1547393619900 = void 0;
const typeorm_1 = require("typeorm");
class AddIsHiddenToCases1547393619900 {
    async up(queryRunner) {
        await queryRunner.addColumn("cases", new typeorm_1.TableColumn({
            name: "is_hidden",
            type: "tinyint",
            unsigned: true,
            default: 0,
        }));
        await queryRunner.createIndex("cases", new typeorm_1.TableIndex({
            columnNames: ["is_hidden"],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("cases", "is_hidden");
    }
}
exports.AddIsHiddenToCases1547393619900 = AddIsHiddenToCases1547393619900;
