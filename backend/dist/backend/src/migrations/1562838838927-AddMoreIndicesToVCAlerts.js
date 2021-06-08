"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMoreIndicesToVCAlerts1562838838927 = void 0;
const typeorm_1 = require("typeorm");
class AddMoreIndicesToVCAlerts1562838838927 {
    async up(queryRunner) {
        const table = (await queryRunner.getTable("vc_alerts"));
        await table.addIndex(new typeorm_1.TableIndex({
            columnNames: ["requestor_id"],
        }));
        await table.addIndex(new typeorm_1.TableIndex({
            columnNames: ["expires_at"],
        }));
    }
    async down(queryRunner) {
        const table = (await queryRunner.getTable("vc_alerts"));
        await table.removeIndex(new typeorm_1.TableIndex({
            columnNames: ["requestor_id"],
        }));
        await table.removeIndex(new typeorm_1.TableIndex({
            columnNames: ["expires_at"],
        }));
    }
}
exports.AddMoreIndicesToVCAlerts1562838838927 = AddMoreIndicesToVCAlerts1562838838927;
