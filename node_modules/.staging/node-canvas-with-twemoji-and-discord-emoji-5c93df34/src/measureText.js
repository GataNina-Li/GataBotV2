const splitEntitiesFromText = require('./utils/splitEntitiesFromText');
const getFontSizeByCssFont = require('./utils/getFontSizeByCssFont');

module.exports = function measureText (
  context,
  text,
  {
    emojiSideMarginPercent = 0.1
  } = {}
) {
  const textEntities = splitEntitiesFromText(text);
  const fontSize = getFontSizeByCssFont(context.font);

  const emojiSideMargin = fontSize * emojiSideMarginPercent;

  let currentWidth = 0;

  for (let i = 0; i < textEntities.length; i++) {
    const entity = textEntities[i];
    if (typeof entity === 'string') {
      // Common text case
      currentWidth += context.measureText(entity).width;
    } else {
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
