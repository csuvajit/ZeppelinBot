"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentSpamTrigger = void 0;
const constants_1 = require("../constants");
const createMessageSpamTrigger_1 = require("../functions/createMessageSpamTrigger");
exports.AttachmentSpamTrigger = createMessageSpamTrigger_1.createMessageSpamTrigger(constants_1.RecentActionType.Attachment, "attachment");
