"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToInt = void 0;
function rgbToInt(rgb) {
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
}
exports.rgbToInt = rgbToInt;
