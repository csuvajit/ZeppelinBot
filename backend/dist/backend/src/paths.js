"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootDir = exports.backendDir = void 0;
const path_1 = __importDefault(require("path"));
const pkg_up_1 = __importDefault(require("pkg-up"));
const backendPackageJson = pkg_up_1.default.sync({
    cwd: __dirname,
});
exports.backendDir = path_1.default.dirname(backendPackageJson);
exports.rootDir = path_1.default.resolve(exports.backendDir, "..");
