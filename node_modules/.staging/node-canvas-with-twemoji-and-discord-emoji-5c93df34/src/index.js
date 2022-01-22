const drawTextWithTwemoji = require('./drawTextWithTwemoji');
const measureText = require('./measureText');

exports.fillTextWithTwemoji = async function (context, text, x, y, options = {}) {
  return await drawTextWithTwemoji(context, 'fill', text, x, y, options);
}

exports.strokeTextWithTwemoji = async function (context, text, x, y, options = {}) {
  return await drawTextWithTwemoji(context, 'stroke', text, x, y, options);
}

exports.measureText = function (context, text, options = {}) {
  return measureText(context, text, options);
}
