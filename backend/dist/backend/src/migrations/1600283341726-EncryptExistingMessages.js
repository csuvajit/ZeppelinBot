"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptExistingMessages1600283341726 = void 0;
const crypt_1 = require("../utils/crypt");
class EncryptExistingMessages1600283341726 {
    async up(queryRunner) {
        // 1. Delete non-permanent messages
        await queryRunner.query("DELETE FROM messages WHERE is_permanent = 0");
        // 2. Encrypt all permanent messages
        const messages = await queryRunner.query("SELECT id, data FROM messages");
        for (const message of messages) {
            const encryptedData = crypt_1.encrypt(message.data);
            await queryRunner.query("UPDATE messages SET data = ? WHERE id = ?", [encryptedData, message.id]);
        }
    }
    async down(queryRunner) {
        // Decrypt all messages
        const messages = await queryRunner.query("SELECT id, data FROM messages");
        for (const message of messages) {
            const decryptedData = crypt_1.decrypt(message.data);
            await queryRunner.query("UPDATE messages SET data = ? WHERE id = ?", [decryptedData, message.id]);
        }
    }
}
exports.EncryptExistingMessages1600283341726 = EncryptExistingMessages1600283341726;
