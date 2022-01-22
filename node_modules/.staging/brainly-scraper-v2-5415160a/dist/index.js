"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Base_1 = __importDefault(require("./src/Base"));
/**
 * @param {String} query Pertanyaan yang akan ditanyakan
 * @param {Integer} count Jumlah data yang akan ditampilkan (default: 5)
 * @param {Languages} lang Bahasa yang akan digunakan
 */
const Brainly1 = async (query, count = 5, lang) => {
    return await Base_1.default(query, count, lang);
};
module.exports = Brainly1;
