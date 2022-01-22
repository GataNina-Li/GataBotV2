"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getVarIntSize(value) {
    let size = 0;
    do {
        value >>>= 7;
        size++;
    } while (value != 0);
    return size;
}
exports.default = getVarIntSize;
