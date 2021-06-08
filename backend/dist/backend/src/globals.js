"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIsAPI = exports.isAPI = void 0;
let isAPIValue = false;
function isAPI() {
    return isAPIValue;
}
exports.isAPI = isAPI;
function setIsAPI(value) {
    isAPIValue = value;
}
exports.setIsAPI = setIsAPI;
