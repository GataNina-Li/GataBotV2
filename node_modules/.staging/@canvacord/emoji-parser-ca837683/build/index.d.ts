import { CanvasRenderingContext2D } from "canvas";
import { Util, ParsedChunks } from "./Util";
export interface MeasureTextData {
    width: number;
    alphabeticBaseline: number;
}
export interface DrawTextWithEmojiParams {
    maxWidth?: Number;
    emojiSideMarginPercent?: number;
    emojiTopMarginPercent?: number;
}
declare class CanvacordEmojiParser {
    constructor();
    static drawTextWithEmoji(context: CanvasRenderingContext2D, fillType: "fill" | "stroke", text: string, x: number, y: number, options?: DrawTextWithEmojiParams): Promise<void>;
    static measureText(context: CanvasRenderingContext2D, text: string, { emojiSideMarginPercent }?: {
        emojiSideMarginPercent?: number;
    }): MeasureTextData;
}
export declare function fillTextWithTwemoji(context: CanvasRenderingContext2D, text: string, x: number, y: number, options?: DrawTextWithEmojiParams): Promise<void>;
export declare function strokeTextWithTwemoji(context: CanvasRenderingContext2D, text: string, x: number, y: number, options?: DrawTextWithEmojiParams): Promise<void>;
export { CanvacordEmojiParser, Util, ParsedChunks };
