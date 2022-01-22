const { parse } = require('twemoji-parser');

/*
 * Split Text
 * ex) 
 *  '君👼の味方🤝だよ'
 *  > ['君', TwemojiObj(👼), 'の味方', TwemojiObj(🤝), 'だよ']
 */

const discordEmojiPattern = "<a?:\\w+:(\\d{17,19})>";

function parseDiscordEmojis(textEntities) {
  const newTextEntities = [];

  for (const entity of textEntities) {
    if (typeof entity === "string")
      for (const word of entity.replace(new RegExp(discordEmojiPattern, "g"), "\u200b$&\u200b").split("\u200b")) {
        const match = word.match(new RegExp(discordEmojiPattern));
        newTextEntities.push(match ? { url: `https://cdn.discordapp.com/emojis/${match[1]}.png` } : word);
      }

    else newTextEntities.push(entity);
  }

  return newTextEntities;
}

module.exports = function splitEntitiesFromText(text) {
  const twemojiEntities = parse(text, { assetType: "png" });

  let unparsedText = text;
  let lastTwemojiIndice = 0;
  const textEntities = [];

  twemojiEntities.forEach((twemoji) => {
    textEntities.push(
      unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice)
    );

    textEntities.push(twemoji);

    unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice);
    lastTwemojiIndice = twemoji.indices[1];
  });

  textEntities.push(unparsedText);

  return parseDiscordEmojis(textEntities);
}
