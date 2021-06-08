"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddActiveFollowsToLocateUser1580654617890 = void 0;
const typeorm_1 = require("typeorm");
class AddActiveFollowsToLocateUser1580654617890 {
    async up(queryRunner) {
        await queryRunner.addColumn("vc_alerts", new typeorm_1.TableColumn({
            name: "active",
            type: "boolean",
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("vc_alerts", "active");
    }
}
exports.AddActiveFollowsToLocateUser1580654617890 = AddActiveFollowsToLocateUser1580654617890;
