"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intToRgb = void 0;
function intToRgb(int) {
    const r = int >> 16;
    const g = (int - (r << 16)) >> 8;
    const b = int - (r << 16) - (g << 8);
    return [r, g, b];
}
exports.intToRgb = intToRgb;
