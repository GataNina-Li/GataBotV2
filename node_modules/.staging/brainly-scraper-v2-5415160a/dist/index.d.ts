/**
 * @param {String} query Pertanyaan yang akan ditanyakan
 * @param {Integer} count Jumlah data yang akan ditampilkan (default: 5)
 * @param {Languages} lang Bahasa yang akan digunakan
 */
declare const Brainly1: (query: string, count?: number, lang?: "tr" | "id" | "us" | "es" | "pt" | "ru" | "ro" | "ph" | "pl" | "hi" | undefined) => Promise<{
    success: boolean;
    length: number;
    headers: any;
    message: string;
    data: import("./src/@typings").FinalData[];
}>;
export = Brainly1;
