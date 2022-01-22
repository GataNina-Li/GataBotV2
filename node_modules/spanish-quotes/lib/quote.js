import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const quotes = require('../data/quotes.json');

const buildRandomNumber = (maxLimit) => {
  return Math.floor(Math.random() * maxLimit);
};

const getRandomQuote = () => {
  const randomNumber = buildRandomNumber(quotes.length);
  return quotes[randomNumber];
};

export { getRandomQuote };
