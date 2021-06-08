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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const db_1 = require("./data/db");
const Configs_1 = require("./data/Configs");
const path_1 = __importDefault(require("path"));
const _fs = __importStar(require("fs"));
const fs = _fs.promises;
const authorId = "444432489818357760";
if (!authorId) {
    console.error("No author id specified");
    process.exit(1);
}
console.log("Connecting to database");
db_1.connect().then(async () => {
    const configs = new Configs_1.Configs();
    console.log("Loading config files");
    const configDir = path_1.default.join(__dirname, "..", "config");
    const configFiles = await fs.readdir(configDir);
    console.log("Looping through config files");
    for (const configFile of configFiles) {
        const parts = configFile.split(".");
        const ext = parts[parts.length - 1];
        if (ext !== "yml")
            continue;
        const id = parts.slice(0, -1).pop();
        const key = id === "global" ? "global" : `guild-${id}`;
        if (await configs.hasConfig(key))
            continue;
        const content = await fs.readFile(path_1.default.join(configDir, configFile), { encoding: "utf8" });
        console.log(`Migrating config for ${key}`);
        await configs.saveNewRevision(key, content, authorId);
    }
    console.log("Done!");
    process.exit(0);
});
