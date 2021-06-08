"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsExclusiveToReactionRoles1575145703039 = void 0;
const typeorm_1 = require("typeorm");
class AddIsExclusiveToReactionRoles1575145703039 {
    async up(queryRunner) {
        await queryRunner.addColumn("reaction_roles", new typeorm_1.TableColumn({
            name: "is_exclusive",
            type: "tinyint",
            unsigned: true,
            default: 0,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("reaction_roles", "is_exclusive");
    }
}
exports.AddIsExclusiveToReactionRoles1575145703039 = AddIsExclusiveToReactionRoles1575145703039;
