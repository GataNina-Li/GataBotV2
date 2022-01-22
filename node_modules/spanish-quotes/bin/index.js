#!/usr/bin/env node

import { EOL } from 'os';
import { getRandomQuote } from '../lib/quote.js';

const randomQuote = getRandomQuote();
let text = randomQuote.quote;
if (randomQuote.from) {
  text += EOL + ' -- ' + randomQuote.from;
}
console.log(text);
