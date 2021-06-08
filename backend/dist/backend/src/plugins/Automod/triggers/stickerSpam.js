"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickerSpamTrigger = void 0;
const constants_1 = require("../constants");
const createMessageSpamTrigger_1 = require("../functions/createMessageSpamTrigger");
exports.StickerSpamTrigger = createMessageSpamTrigger_1.createMessageSpamTrigger(constants_1.RecentActionType.Sticker, "sticker");
