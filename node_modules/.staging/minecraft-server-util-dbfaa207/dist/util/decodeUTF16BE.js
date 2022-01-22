"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
/**
 * Decodes a regular UTF-8 string into a UTF-16BE string
 * @param {string} value The UTF-8 string
 * @returns {string} The UTF-16 string
 */
function decodeUTF16BE(value) {
    assert_1.default(value.length % 2 === 0, 'Expected UTF-16 string length to be a multiple of 2, got ' + value.length);
    const result = [];
    for (let i = 0; i < value.length; i += 2) {
        result.push(((value.charCodeAt(i) << 8) & 0xFF) | (value.charCodeAt(i + 1) & 0xFF));
    }
    return String.fromCharCode(...result);
}
exports.default = decodeUTF16BE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2RlVVRGMTZCRS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2RlY29kZVVURjE2QkUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFFNUI7Ozs7R0FJRztBQUNILFNBQVMsYUFBYSxDQUFDLEtBQWE7SUFDbkMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsMkRBQTJELEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTNHLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ3BGO0lBRUQsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVELGtCQUFlLGFBQWEsQ0FBQyJ9