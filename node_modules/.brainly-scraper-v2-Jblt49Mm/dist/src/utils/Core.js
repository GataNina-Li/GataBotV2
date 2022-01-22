"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = exports._required = void 0;
const BrainlyError_1 = __importDefault(require("./BrainlyError"));
/**
* Check variable value
* @param {*} variable
 */
function _required(variable) {
    if (variable == "" || variable == undefined) {
        throw new BrainlyError_1.default("Param can't be blank");
    }
}
exports._required = _required;
/**
* replacle all html syntax
* @param {string} data
* @param {string}
*/
const clean = (data) => {
    const regex = /(<([^>]+)>)/ig;
    data = data.replace(/(<br?\s?\/>)/ig, ' \n');
    return data.replace(regex, "");
};
exports.clean = clean;
