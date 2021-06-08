"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEncryptedTextTransformer = void 0;
const crypt_1 = require("../utils/crypt");
function createEncryptedTextTransformer() {
    return {
        // Database -> Entity
        from(dbValue) {
            return crypt_1.decrypt(dbValue);
        },
        // Entity -> Database
        to(entityValue) {
            return crypt_1.encrypt(entityValue);
        },
    };
}
exports.createEncryptedTextTransformer = createEncryptedTextTransformer;
