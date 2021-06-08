"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./loadEnv");
const db_1 = require("../data/db");
const globals_1 = require("../globals");
if (!process.env.KEY) {
    // tslint:disable-next-line:no-console
    console.error("Project root .env with KEY is required!");
    process.exit(1);
}
function errorHandler(err) {
    console.error(err.stack || err); // tslint:disable-line:no-console
    process.exit(1);
}
process.on("unhandledRejection", errorHandler);
globals_1.setIsAPI(true);
// Connect to the database before loading the rest of the code (that depend on the database connection)
console.log("Connecting to database..."); // tslint:disable-line
db_1.connect().then(() => {
    Promise.resolve().then(() => __importStar(require("./start")));
});
