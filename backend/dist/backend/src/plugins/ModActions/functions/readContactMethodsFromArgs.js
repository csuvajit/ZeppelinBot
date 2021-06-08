"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readContactMethodsFromArgs = void 0;
const utils_1 = require("../../../utils");
function readContactMethodsFromArgs(args) {
    if (args.notify) {
        if (args.notify === "dm") {
            return [{ type: "dm" }];
        }
        else if (args.notify === "channel") {
            if (!args["notify-channel"]) {
                throw new Error("No `-notify-channel` specified");
            }
            return [{ type: "channel", channel: args["notify-channel"] }];
        }
        else if (utils_1.disableUserNotificationStrings.includes(args.notify)) {
            return [];
        }
        else {
            throw new Error("Unknown contact method");
        }
    }
    return null;
}
exports.readContactMethodsFromArgs = readContactMethodsFromArgs;
