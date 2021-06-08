"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChunkedEmbedFields = void 0;
const utils_1 = require("../utils");
function getChunkedEmbedFields(name, value, inline) {
    const fields = [];
    const chunks = utils_1.chunkMessageLines(value, 1014);
    for (let i = 0; i < chunks.length; i++) {
        if (i === 0) {
            fields.push({
                name,
                value: chunks[i],
            });
        }
        else {
            fields.push({
                name: utils_1.emptyEmbedValue,
                value: chunks[i],
            });
        }
    }
    return fields;
}
exports.getChunkedEmbedFields = getChunkedEmbedFields;
