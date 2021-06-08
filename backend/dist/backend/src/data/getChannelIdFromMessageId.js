"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelIdFromMessageId = void 0;
const SavedMessage_1 = require("./entities/SavedMessage");
const typeorm_1 = require("typeorm");
let repository;
async function getChannelIdFromMessageId(messageId) {
    if (!repository) {
        repository = typeorm_1.getRepository(SavedMessage_1.SavedMessage);
    }
    const savedMessage = await repository.findOne(messageId);
    if (savedMessage) {
        return savedMessage.channel_id;
    }
    return null;
}
exports.getChannelIdFromMessageId = getChannelIdFromMessageId;
