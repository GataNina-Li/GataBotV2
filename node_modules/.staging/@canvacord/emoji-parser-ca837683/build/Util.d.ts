import { Image } from "canvas";
export declare type ParsedChunks = (string | {
    url: string;
})[];
declare class Util {
    constructor();
    static parseDiscordEmojis(textEntities: string[]): ParsedChunks;
    static split(text: string): ParsedChunks;
    static loadEmojis(url: string): Promise<Image>;
    static getFontSize(font: string): number;
}
export { Util };
