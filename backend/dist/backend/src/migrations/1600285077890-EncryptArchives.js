"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptArchives1600285077890 = void 0;
const crypt_1 = require("../utils/crypt");
class EncryptArchives1600285077890 {
    async up(queryRunner) {
        const archives = await queryRunner.query("SELECT id, body FROM archives");
        for (const archive of archives) {
            const encryptedBody = crypt_1.encrypt(archive.body);
            await queryRunner.query("UPDATE archives SET body = ? WHERE id = ?", [encryptedBody, archive.id]);
        }
    }
    async down(queryRunner) {
        const archives = await queryRunner.query("SELECT id, body FROM archives");
        for (const archive of archives) {
            const decryptedBody = crypt_1.decrypt(archive.body);
            await queryRunner.query("UPDATE archives SET body = ? WHERE id = ?", [decryptedBody, archive.id]);
        }
    }
}
exports.EncryptArchives1600285077890 = EncryptArchives1600285077890;
