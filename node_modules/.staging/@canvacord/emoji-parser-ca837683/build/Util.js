"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const twemoji_parser_1 = require("twemoji-parser");
const canvas_1 = require("canvas");
const emojiCache = new Map();
const discordEmojiPattern = "<a?:\\w+:(\\d{17,19})>";
const defaultHeight = 16;
class Util {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }
    static parseDiscordEmojis(textEntities) {
        const newTextEntities = [];
        for (const entity of textEntities) {
            if (typeof entity === "string") {
                const words = entity.replace(new RegExp(discordEmojiPattern, "g"), "\u200b$&\u200b").split("\u200b");
                for (const word of words)
                    newTextEntities.push(word.match(new RegExp(discordEmojiPattern)) ? { url: `https://cdn.discordapp.com/emojis/${word.match(new RegExp(discordEmojiPattern))[1]}.png` } : word);
            }
            else
                newTextEntities.push(entity);
        }
        return newTextEntities;
    }
    static split(text) {
        const twemojiEntities = twemoji_parser_1.parse(text, { assetType: "png" });
        let unparsedText = text;
        let lastTwemojiIndice = 0;
        const textEntities = [];
        twemojiEntities.forEach((twemoji) => {
            textEntities.push(unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice));
            textEntities.push(twemoji);
            unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice);
            lastTwemojiIndice = twemoji.indices[1];
        });
        textEntities.push(unparsedText);
        return Util.parseDiscordEmojis(textEntities);
    }
    static async loadEmojis(url) {
        if (emojiCache.has(url))
            return emojiCache.get(url);
        const image = await canvas_1.loadImage(url);
        if (!url.includes("cdn.discordapp.com"))
            emojiCache.set(url, image);
        return image;
    }
    static getFontSize(font) {
        if (typeof font !== "string")
            return defaultHeight;
        const sizeFamily = font.match(/([0-9.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)/);
        if (sizeFamily.length !== 3) {
            return defaultHeight;
        }
        switch (sizeFamily[2]) {
            case "pt":
                return Number(sizeFamily[1]) / 0.75;
            case "pc":
                return Number(sizeFamily[1]) * 16;
            case "in":
                return Number(sizeFamily[1]) * 96;
            case "cm":
                return Number(sizeFamily[1]) * (96.0 / 2.54);
            case "mm":
                return Number(sizeFamily[1]) * (96.0 / 25.4);
            case "%":
                return Number(sizeFamily[1]) * (defaultHeight / 100 / 0.75);
            case "em":
            case "rem":
                return Number(sizeFamily[1]) * (defaultHeight / 0.75);
            case "q":
                return Number(sizeFamily[1]) * (96 / 25.4 / 4);
            case "px":
            default:
                return Number(sizeFamily[1]);
        }
    }
}
exports.Util = Util;
