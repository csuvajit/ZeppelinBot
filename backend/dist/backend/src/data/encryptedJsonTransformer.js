"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEncryptedJsonTransformer = void 0;
const crypt_1 = require("../utils/crypt");
function createEncryptedJsonTransformer() {
    return {
        // Database -> Entity
        from(dbValue) {
            const decrypted = crypt_1.decrypt(dbValue);
            return JSON.parse(decrypted);
        },
        // Entity -> Database
        to(entityValue) {
            return crypt_1.encrypt(JSON.stringify(entityValue));
        },
    };
}
exports.createEncryptedJsonTransformer = createEncryptedJsonTransformer;
