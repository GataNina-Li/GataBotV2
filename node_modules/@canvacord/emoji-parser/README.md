# Emoji Parser
Emoji parser for **[Canvacord](https://npmjs.com/package/canvacord)**.

# Emojis
- twemoji
- discord emojis

# Installing

```sh
$ npm i @canvacord/emoji-parser
```

# Example

```js
const Canvas = require("canvas");
const { fillTextWithTwemoji } = require("@canvacord/emoji-parser");
const fs = require("fs");

const canvas = Canvas.createCanvas(500, 270);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#FF0000";
ctx.font = "32px Arial";

fillTextWithTwemoji(ctx, "Hello World 😊 <:kek:750253062689652768>", 120, 150)
    .then(() => {
        fs.writeFileSync("./img.png", canvas.toBuffer())
    })
    .catch(console.error);

```

## With Typescript

```ts
import { fillTextWithTwemoji } from "@canvacord/emoji-parser";
```

## Preview
![Preview](https://i.imgur.com/1hyyd5P.png)

# Available Methods

## fillTextWithEmoji(context: CanvasRenderingContext2D, text: string, x: number, y: number, options?: DrawTextWithEmojiParams): Promise<void>
Renders emojis with `fillType: "fill"`.

## strokeTextWithEmoji(context: CanvasRenderingContext2D, text: string, x: number, y: number, options?: DrawTextWithEmojiParams): Promise<void>
Renders emojis with `fillType: "stroke"`.

## drawTextWithEmoji(context: CanvasRenderingContext2D, fillType: "fill" | "stroke", text: string, x: number, y: number, options?: DrawTextWithEmojiParams): Promise<void>
Main method used by both `fillTextWithEmoji` and `strokeTextWithEmoji`.