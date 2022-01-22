import type { FinalData } from "./@typings";
/**
 * @param {String} query Pertanyaan yang akan ditanyakan
 * @param {Integer} count Jumlah data yang akan ditampilkan
 * @param {Languages} lang Bahasa yang akan dipilih
 */
declare const Brainly: (query: string, count: number, lang?: "tr" | "id" | "us" | "es" | "pt" | "ru" | "ro" | "ph" | "pl" | "hi" | undefined) => Promise<{
    success: boolean;
    length: number;
    headers: any;
    message: string;
    data: FinalData[];
}>;
export { Brainly as default };
