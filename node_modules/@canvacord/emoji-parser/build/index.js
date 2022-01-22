"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = exports.CanvacordEmojiParser = exports.strokeTextWithTwemoji = exports.fillTextWithTwemoji = void 0;
const Util_1 = require("./Util");
Object.defineProperty(exports, "Util", { enumerable: true, get: function () { return Util_1.Util; } });
class CanvacordEmojiParser {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }
    static async drawTextWithEmoji(context, fillType, text, x, y, options) {
        const ops = {
            maxWidth: options && options.maxWidth || Infinity,
            emojiSideMarginPercent: options && options.emojiSideMarginPercent || 0.1,
            emojiTopMarginPercent: options && options.emojiTopMarginPercent || 0.1
        };
        const textEntities = Util_1.Util.split(text);
        const fontSize = Util_1.Util.getFontSize(context.font);
        const baseLine = context.measureText('').alphabeticBaseline;
        const textAlign = context.textAlign;
        const emojiSideMargin = fontSize * ops.emojiSideMarginPercent;
        const emojiTopMargin = fontSize * ops.emojiTopMarginPercent;
        const textWidth = CanvacordEmojiParser.measureText(context, text, { emojiSideMarginPercent: ops.emojiSideMarginPercent }).width;
        // for Text align
        let textLeftMargin = 0;
        if (!['', 'left', 'start'].includes(textAlign)) {
            context.textAlign = 'left';
            switch (textAlign) {
                case 'center':
                    textLeftMargin = -textWidth / 2;
                    break;
                case 'right':
                case 'end':
                    textLeftMargin = -textWidth;
                    break;
            }
        }
        // Drawing
        let currentWidth = 0;
        for (let i = 0; i < textEntities.length; i++) {
            const entity = textEntities[i];
            if (typeof entity === 'string') {
                // Common text case
                if (fillType === 'fill') {
                    context.fillText(entity, textLeftMargin + x + currentWidth, y);
                }
                else {
                    context.strokeText(entity, textLeftMargin + x + currentWidth, y);
                }
                currentWidth += context.measureText(entity).width;
            }
            else {
                // Emoji case
                const emoji = await Util_1.Util.loadEmojis(entity.url);
                context.drawImage(emoji, textLeftMargin + x + currentWidth + emojiSideMargin, y + emojiTopMargin - fontSize - baseLine, fontSize, fontSize);
                currentWidth += fontSize + (emojiSideMargin * 2);
            }
        }
        // Restore
        if (textAlign) {
            context.textAlign = textAlign;
        }
    }
    static measureText(context, text, { emojiSideMarginPercent = 0.1 } = {}) {
        const textEntities = Util_1.Util.split(text);
        const fontSize = Util_1.Util.getFontSize(context.font);
        const emojiSideMargin = fontSize * emojiSideMarginPercent;
        let currentWidth = 0;
        for (let i = 0; i < textEntities.length; i++) {
            const entity = textEntities[i];
            if (typeof entity === 'string') {
                // Common text case
                currentWidth += context.measureText(entity).width;
            }
            else {
                // Emoji case
                currentWidth += fontSize + (emojiSideMargin * 2);
            }
        }
        const measured = context.measureText('');
        return {
            width: currentWidth,
            alphabeticBaseline: measured.alphabeticBaseline
        };
    }
}
exports.CanvacordEmojiParser = CanvacordEmojiParser;
function fillTextWithTwemoji(context, text, x, y, options) {
    return CanvacordEmojiParser.drawTextWithEmoji(context, "fill", text, x, y, options);
}
exports.fillTextWithTwemoji = fillTextWithTwemoji;
function strokeTextWithTwemoji(context, text, x, y, options) {
    return CanvacordEmojiParser.drawTextWithEmoji(context, "stroke", text, x, y, options);
}
exports.strokeTextWithTwemoji = strokeTextWithTwemoji;
