import Brainly from "./src/Base";
import type { Languages } from "./src/@typings";

/**
 * @param {String} query Pertanyaan yang akan ditanyakan
 * @param {Integer} count Jumlah data yang akan ditampilkan (default: 5)
 * @param {Languages} lang Bahasa yang akan digunakan
 */
const Brainly1 = async (query: string, count = 5, lang?: Languages) => {
    return await Brainly(query, count, lang);
}

export = Brainly1;