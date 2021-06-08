"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSpamTrigger = void 0;
const constants_1 = require("../constants");
const createMessageSpamTrigger_1 = require("../functions/createMessageSpamTrigger");
exports.MessageSpamTrigger = createMessageSpamTrigger_1.createMessageSpamTrigger(constants_1.RecentActionType.Message, "message");
